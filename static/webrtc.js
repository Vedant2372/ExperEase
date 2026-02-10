// webrtc.js
// WebRTC implementation for ExpertEase video consultations
// Handles peer-to-peer video calling with Socket.IO signaling

class ExpertEaseVideoCall {
    constructor(appointmentId, role, roomName) {
        this.appointmentId = appointmentId;
        this.role = role;
        this.roomName = roomName;
        this.socket = null;
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.isInitiator = false;
        this.isCallActive = false;
        
        // WebRTC configuration
        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        };
        
        this.initializeSocket();
        this.setupPeerConnection();
    }
    
    initializeSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('🔗 Connected to signaling server');
            this.joinRoom();
        });
        
        this.socket.on('disconnect', () => {
            console.log('🔌 Disconnected from signaling server');
        });
        
        // Signaling events
        this.socket.on('receive_offer', (data) => {
            console.log('📥 Received offer:', data);
            this.handleOffer(data);
        });
        
        this.socket.on('receive_answer', (data) => {
            console.log('📤 Received answer:', data);
            this.handleAnswer(data);
        });
        
        this.socket.on('receive_ice_candidate', (data) => {
            console.log('🧊 Received ICE candidate:', data);
            this.handleIceCandidate(data);
        });
        
        // Room events
        this.socket.on('user_joined', (data) => {
            console.log('👤 User joined:', data);
            if (data.role === 'doctor') {
                this.showNotification('Doctor has joined the consultation', 'info');
            }
        });
        
        this.socket.on('otp_verified', (data) => {
            console.log('🔐 OTP verified:', data);
            if (this.role === 'user') {
                this.hideWaitingOverlay();
                this.enableCallControls();
                this.showNotification('Doctor has started the consultation!', 'success');
            }
        });
        
        this.socket.on('new_prescription', (data) => {
            console.log('📝 New prescription:', data);
            if (this.role === 'user') {
                this.showNotification('New prescription available!', 'info');
                this.showPrescriptionDownload(data.filename, data.download_url);
            }
        });
        
        this.socket.on('call_ended', (data) => {
            console.log('📞 Call ended:', data);
            this.endCall();
            this.showNotification('Consultation completed', 'info');
        });
        
        this.socket.on('waiting_for_doctor', (data) => {
            console.log('⏳ Waiting for doctor:', data);
            this.showWaitingOverlay(data.message);
        });
        
        this.socket.on('waiting_for_otp', (data) => {
            console.log('🔐 Waiting for OTP:', data);
            if (this.role === 'doctor') {
                this.showWaitingOverlay(data.message);
            }
        });
    }
    
    setupPeerConnection() {
        try {
            this.peerConnection = new RTCPeerConnection(this.configuration);
            
            // ICE candidate handling
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('🧊 Sending ICE candidate');
                    this.socket.emit('send_ice_candidate', {
                        room: this.roomName,
                        candidate: {
                            candidate: event.candidate.candidate,
                            sdpMLineIndex: event.candidate.sdpMLineIndex,
                            sdpMid: event.candidate.sdpMid
                        }
                    });
                }
            };
            
            // Remote track handling
            this.peerConnection.ontrack = (event) => {
                console.log('📹 Received remote track:', event.track.kind);
                if (event.track.kind === 'video') {
                    this.remoteStream = event.stream;
                    this.addRemoteVideo(event.stream);
                }
            };
            
            // Connection state changes
            this.peerConnection.onconnectionstatechange = () => {
                console.log('🔄 Connection state:', this.peerConnection.connectionState);
                if (this.peerConnection.connectionState === 'connected') {
                    this.showNotification('Connected successfully!', 'success');
                } else if (this.peerConnection.connectionState === 'disconnected' || this.peerConnection.connectionState === 'failed') {
                    this.showNotification('Connection lost', 'error');
                }
            };
            
        } catch (error) {
            console.error('❌ Failed to setup peer connection:', error);
            this.showNotification('Failed to setup video call', 'error');
        }
    }
    
    async joinRoom() {
        this.socket.emit('join_room', {
            room: this.roomName,
            appointment_id: this.appointmentId,
            role: this.role
        });
    }
    
    async createOffer() {
        try {
            if (!this.localStream) {
                throw new Error('Local stream not available');
            }
            
            // Add local stream to peer connection
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track);
            });
            
            // Create offer
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            // Send offer to signaling server
            this.socket.emit('send_offer', {
                room: this.roomName,
                offer: {
                    type: offer.type,
                    sdp: offer.sdp
                }
            });
            
            console.log('📤 Offer created and sent');
            
        } catch (error) {
            console.error('❌ Failed to create offer:', error);
            this.showNotification('Failed to start call', 'error');
        }
    }
    
    async handleOffer(offerData) {
        try {
            await this.peerConnection.setRemoteDescription(offerData);
            
            // Create and send answer
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            this.socket.emit('send_answer', {
                room: this.roomName,
                answer: {
                    type: answer.type,
                    sdp: answer.sdp
                }
            });
            
            console.log('📤 Answer created and sent');
            
        } catch (error) {
            console.error('❌ Failed to handle offer:', error);
            this.showNotification('Failed to join call', 'error');
        }
    }
    
    async handleAnswer(answerData) {
        try {
            await this.peerConnection.setRemoteDescription(answerData);
            console.log('📥 Answer received and set');
            
        } catch (error) {
            console.error('❌ Failed to handle answer:', error);
            this.showNotification('Failed to connect', 'error');
        }
    }
    
    async handleIceCandidate(candidateData) {
        try {
            if (candidateData && candidateData.candidate) {
                const candidate = new RTCIceCandidate({
                    candidate: candidateData.candidate.candidate,
                    sdpMLineIndex: candidateData.candidate.sdpMLineIndex,
                    sdpMid: candidateData.candidate.sdpMid
                });
                
                await this.peerConnection.addIceCandidate(candidate);
                console.log('🧊 ICE candidate added');
            }
            
        } catch (error) {
            console.error('❌ Failed to handle ICE candidate:', error);
        }
    }
    
    async getUserMedia() {
        try {
            const constraints = {
                video: {
                    width: { min: 640, ideal: 1280 },
                    height: { min: 480, ideal: 720 },
                    frameRate: { max: 30 }
                },
                audio: true
            };
            
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('📹 Local media obtained');
            
            // Show local video for doctor
            if (this.role === 'doctor') {
                this.addLocalVideo();
            }
            
            return this.localStream;
            
        } catch (error) {
            console.error('❌ Failed to get user media:', error);
            this.showNotification('Failed to access camera/microphone', 'error');
            throw error;
        }
    }
    
    addLocalVideo() {
        const localVideo = document.getElementById('local-video');
        if (localVideo && this.localStream) {
            localVideo.srcObject = this.localStream;
            localVideo.style.display = 'block';
        }
    }
    
    addRemoteVideo(stream) {
        const remoteVideo = document.getElementById('remote-video');
        if (remoteVideo) {
            remoteVideo.srcObject = stream;
        }
    }
    
    async startCall() {
        if (this.role !== 'doctor') {
            this.showNotification('Only doctor can start the call', 'error');
            return;
        }
        
        try {
            // Get user media
            await this.getUserMedia();
            
            // Create offer
            this.isInitiator = true;
            await this.createOffer();
            
            this.isCallActive = true;
            this.startCallTimer();
            this.showNotification('Call started!', 'success');
            
        } catch (error) {
            console.error('❌ Failed to start call:', error);
            this.showNotification('Failed to start call', 'error');
        }
    }
    
    endCall() {
        // Stop local media
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        // Close peer connection
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        
        // Hide local video
        const localVideo = document.getElementById('local-video');
        if (localVideo) {
            localVideo.style.display = 'none';
        }
        
        // Clear remote video
        const remoteVideo = document.getElementById('remote-video');
        if (remoteVideo) {
            remoteVideo.srcObject = null;
        }
        
        this.isCallActive = false;
        this.stopCallTimer();
        
        // Notify server
        this.socket.emit('end_call', {
            room: this.roomName,
            appointment_id: this.appointmentId
        });
        
        this.showNotification('Call ended', 'info');
    }
    
    startCallTimer() {
        this.callStartTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateCallTimer();
        }, 1000);
        
        const callTimer = document.getElementById('call-timer');
        if (callTimer) {
            callTimer.style.display = 'block';
        }
    }
    
    updateCallTimer() {
        if (!this.callStartTime) return;
        
        const elapsed = Math.floor((Date.now() - this.callStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        const callTimer = document.getElementById('call-timer');
        if (callTimer) {
            callTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    stopCallTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const callTimer = document.getElementById('call-timer');
        if (callTimer) {
            callTimer.style.display = 'none';
        }
    }
    
    showWaitingOverlay(message = 'Waiting for other participant...') {
        const overlay = document.getElementById('waiting-overlay');
        if (overlay) {
            overlay.querySelector('p').textContent = message;
            overlay.style.display = 'flex';
        }
    }
    
    hideWaitingOverlay() {
        const overlay = document.getElementById('waiting-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        console.log(`🔔 ${type.toUpperCase()}: ${message}`);
    }
    
    enableCallControls() {
        const startBtn = document.getElementById('start-call-btn');
        const endBtn = document.getElementById('end-call-btn');
        const prescriptionSection = document.getElementById('prescription-section');
        
        if (startBtn) startBtn.style.display = 'none';
        if (endBtn) endBtn.style.display = 'block';
        if (prescriptionSection && this.role === 'doctor') {
            prescriptionSection.style.display = 'block';
        }
    }
    
    showPrescriptionDownload(filename, downloadUrl) {
        const controlsSection = document.getElementById('call-controls');
        if (!controlsSection) return;
        
        // Create download link
        const downloadDiv = document.createElement('div');
        downloadDiv.className = 'status-section';
        downloadDiv.innerHTML = `
            <div class="status-title">📄 Prescription Available</div>
            <a href="${downloadUrl}" download="${filename}" class="btn btn-primary">📥 Download ${filename}</a>
        `;
        
        controlsSection.appendChild(downloadDiv);
    }
}

// Global function for OTP verification
async function verifyOTP(appointmentId, otp) {
    try {
        const response = await fetch('/video/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appointment_id: appointmentId,
                otp: otp
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('OTP verified successfully!', 'success');
            return true;
        } else {
            showNotification(result.error || 'Invalid OTP', 'error');
            return false;
        }
        
    } catch (error) {
        console.error('OTP verification error:', error);
        showNotification('Failed to verify OTP', 'error');
        return false;
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function validateOTP(otp) {
    return /^\d{6}$/.test(otp);
}

function formatCallDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Export for use in HTML
window.ExpertEaseVideoCall = ExpertEaseVideoCall;
window.verifyOTP = verifyOTP;
