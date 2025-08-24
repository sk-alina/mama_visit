import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from '../firebase';

// Custom hook for Firestore operations
export const useFirestore = (collectionName, orderByField = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    let q = collectionRef;
    
    if (orderByField) {
      q = query(collectionRef, orderBy(orderByField, 'desc'));
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(documents);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, orderByField]);

  // Add document
  const addDocument = async (documentData) => {
    try {
      setError(null);
      const docRef = await addDoc(collection(db, collectionName), {
        ...documentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding document:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update document
  const updateDocument = async (id, updates) => {
    try {
      setError(null);
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete document
  const deleteDocument = async (id) => {
    try {
      setError(null);
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument
  };
};

// Specific hook for diary entries
export const useDiaryEntries = () => {
  return useFirestore('diaryEntries', 'date');
};

// Specific hook for contacts
export const useContacts = () => {
  return useFirestore('contacts');
};

// Specific hook for welcome video
export const useWelcomeVideo = () => {
  return useFirestore('welcomeVideo');
};

// Specific hook for itinerary items
export const useItinerary = () => {
  return useFirestore('itinerary', 'date');
};

// Specific hook for wishlist items
export const useWishlist = () => {
  return useFirestore('wishlist');
};

// Specific hook for address info
export const useAddressInfo = () => {
  return useFirestore('addressInfo');
};
