import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import { uploadDocument, getWorkerDocuments } from '../../services/api';

const { width, height } = Dimensions.get('window');

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: string;
  uri?: string;
}

export default function DocumentUpload() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getWorkerDocuments('worker-1'); // Use actual worker ID
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result: DocumentPickerResponse = await DocumentPicker.pick({
        type: [types.pdf, types.images, types.docx, types.doc],
        allowMultiSelect: false,
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        await uploadDocumentToServer(asset);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled
        return;
      }
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadDocumentToServer = async (asset: any) => {
    setUploading(true);
    
    try {
      const response = await uploadDocument(
        {
          uri: asset.uri,
          name: asset.name,
          type: asset.type,
          size: asset.size,
        },
        'worker-1' // Use actual worker ID
      );

      Alert.alert(
        'Success',
        'Document uploaded successfully! Verification pending.',
        [{ text: 'OK', onPress: () => loadDocuments() }]
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return 'check-circle';
      case 'pending':
        return 'schedule';
      case 'rejected':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const renderDocumentItem = (doc: Document) => (
    <TouchableOpacity
      key={doc.id}
      style={styles.documentItem}
      onPress={() => {
        setSelectedDocument(doc);
        setModalVisible(true);
      }}
    >
      <View style={styles.documentHeader}>
        <View style={styles.documentIcon}>
          <Icon name="description" size={24} color="#9333ea" />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName}>{doc.name}</Text>
          <Text style={styles.documentType}>{doc.type}</Text>
          <Text style={styles.documentDate}>Uploaded: {doc.uploadDate}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Icon 
            name={getStatusIcon(doc.status)} 
            size={20} 
            color={getStatusColor(doc.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(doc.status) }]}>
            {doc.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRequiredDocuments = () => {
    const requiredDocs = [
      { name: 'Medical Degree Certificate', description: 'Your medical degree proof', icon: 'school' },
      { name: 'Medical License', description: 'Valid medical license', icon: 'verified' },
      { name: 'ID Proof', description: 'Government issued ID', icon: 'badge' },
      { name: 'Specialization Certificate', description: 'Specialization proof', icon: 'stars' },
      { name: 'Experience Certificates', description: 'Work experience proof', icon: 'work' },
    ];

    return (
      <View style={styles.requiredSection}>
        <Text style={styles.sectionTitle}>Required Documents</Text>
        <Text style={styles.sectionSubtitle}>
          Upload all required documents for verification
        </Text>
        
        {requiredDocs.map((doc, index) => (
          <View key={index} style={styles.requiredDocItem}>
            <View style={styles.requiredDocIcon}>
              <Icon name={doc.icon} size={20} color="#9333ea" />
            </View>
            <View style={styles.requiredDocInfo}>
              <Text style={styles.requiredDocName}>{doc.name}</Text>
              <Text style={styles.requiredDocDesc}>{doc.description}</Text>
            </View>
            <View style={styles.requiredDocStatus}>
              {documents.some(d => d.name === doc.name) ? (
                <Icon name="check-circle" size={20} color="#10b981" />
              ) : (
                <Icon name="radio-button-unchecked" size={20} color="#9ca3af" />
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#9333ea', '#7c3aed']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Document Upload</Text>
          <Text style={styles.headerSubtitle}>Upload and manage your documents</Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleDocumentPick}
          disabled={uploading}
        >
          <LinearGradient
            colors={['#9333ea', '#7c3aed']}
            style={styles.uploadButtonGradient}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Icon name="cloud-upload" size={24} color="#ffffff" />
            )}
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Required Documents */}
        {renderRequiredDocuments()}

        {/* Uploaded Documents */}
        <View style={styles.uploadedSection}>
          <Text style={styles.sectionTitle}>Uploaded Documents</Text>
          <Text style={styles.sectionSubtitle}>
            {documents.length} document(s) uploaded
          </Text>

          {documents.length > 0 ? (
            documents.map(renderDocumentItem)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="folder-open" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No documents uploaded yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the upload button to get started
              </Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Upload Tips</Text>
          
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>
              Upload clear, readable documents
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>
              Ensure documents are not expired
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>
              PDF format is preferred
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>
              Maximum file size: 10MB
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Document Details Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            {selectedDocument && (
              <View style={styles.modalBody}>
                <View style={styles.modalDocIcon}>
                  <Icon name="description" size={32} color="#9333ea" />
                </View>
                <Text style={styles.modalDocName}>{selectedDocument.name}</Text>
                <Text style={styles.modalDocType}>{selectedDocument.type}</Text>
                
                <View style={styles.modalStatus}>
                  <Icon 
                    name={getStatusIcon(selectedDocument.status)} 
                    size={20} 
                    color={getStatusColor(selectedDocument.status)} 
                  />
                  <Text style={[styles.modalStatusText, { color: getStatusColor(selectedDocument.status) }]}>
                    {selectedDocument.status.toUpperCase()}
                  </Text>
                </View>
                
                <Text style={styles.modalDate}>
                  Uploaded: {selectedDocument.uploadDate}
                </Text>
                
                {selectedDocument.status === 'pending' && (
                  <View style={styles.pendingNotice}>
                    <Icon name="info" size={16} color="#f59e0b" />
                    <Text style={styles.pendingText}>
                      Your document is under review. This usually takes 2-3 hours.
                    </Text>
                  </View>
                )}
                
                {selectedDocument.status === 'rejected' && (
                  <View style={styles.rejectedNotice}>
                    <Icon name="error" size={16} color="#ef4444" />
                    <Text style={styles.rejectedText}>
                      Document verification failed. Please upload a valid document.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e9d5ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  uploadButton: {
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  requiredSection: {
    marginBottom: 24,
  },
  requiredDocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requiredDocIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requiredDocInfo: {
    flex: 1,
  },
  requiredDocName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  requiredDocDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  requiredDocStatus: {
    marginLeft: 12,
  },
  uploadedSection: {
    marginBottom: 24,
  },
  documentItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  documentType: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  statusContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: width - 40,
    maxHeight: height - 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  modalDocIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDocName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  modalDocType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  modalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  modalDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  pendingNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  pendingText: {
    fontSize: 12,
    color: '#92400e',
    marginLeft: 8,
    flex: 1,
  },
  rejectedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fecaca',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  rejectedText: {
    fontSize: 12,
    color: '#991b1b',
    marginLeft: 8,
    flex: 1,
  },
});
