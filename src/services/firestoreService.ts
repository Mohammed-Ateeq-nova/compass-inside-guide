import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Store, Rack, Floor, NavigationSession } from '../types';

// Geocoding function
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYXRlZXEtbm92YSIsImEiOiJjbWQxb2JtYmsxMDlzMmtxdzhuY2h1eHhuIn0.3pdQelFzklbZ_4bahneGhQ'}`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Store operations
export const createStore = async (storeData: Omit<Store, 'id'>) => {
  const docRef = await addDoc(collection(db, 'stores'), storeData);
  return docRef.id;
};

export const updateStore = async (storeId: string, updates: Partial<Store>) => {
  await updateDoc(doc(db, 'stores', storeId), {
    ...updates,
    updatedAt: new Date()
  });
};

export const deleteStore = async (storeId: string) => {
  await deleteDoc(doc(db, 'stores', storeId));
};

export const getStores = async (adminId: string): Promise<Store[]> => {
  const q = query(collection(db, 'stores'), where('adminId', '==', adminId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  })) as Store[];
};

// Rack operations
export const createRack = async (rackData: Omit<Rack, 'id'>) => {
  const docRef = await addDoc(collection(db, 'racks'), rackData);
  return docRef.id;
};

export const getRacks = async (storeId: string, floorId: string): Promise<Rack[]> => {
  const q = query(
    collection(db, 'racks'), 
    where('storeId', '==', storeId),
    where('floorId', '==', floorId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Rack[];
};

export const updateRack = async (rackId: string, updates: Partial<Rack>) => {
  await updateDoc(doc(db, 'racks', rackId), updates);
};

export const deleteRack = async (rackId: string) => {
  await deleteDoc(doc(db, 'racks', rackId));
};

export const getAllRacksForStore = async (storeId: string): Promise<Rack[]> => {
  const q = query(collection(db, 'racks'), where('storeId', '==', storeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Rack[];
};

// Floor operations
export const saveFloor = async (floorData: Floor) => {
  if (floorData.id) {
    await updateDoc(doc(db, 'floors', floorData.id), floorData);
  } else {
    const docRef = await addDoc(collection(db, 'floors'), floorData);
    return docRef.id;
  }
};

export const getFloors = async (storeId: string): Promise<Floor[]> => {
  const q = query(
    collection(db, 'floors'), 
    where('storeId', '==', storeId)
  );
  const snapshot = await getDocs(q);
  const floors = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Floor[];
  
  // Sort by level on the client side to avoid composite index requirement
  return floors.sort((a, b) => (a.level || 0) - (b.level || 0));
};

export const deleteFloor = async (floorId: string) => {
  await deleteDoc(doc(db, 'floors', floorId));
};

// Navigation session operations
export const createNavigationSession = async (sessionData: Omit<NavigationSession, 'id'>) => {
  const docRef = await addDoc(collection(db, 'navigationSessions'), sessionData);
  return docRef.id;
};

export const getNavigationSession = async (sessionId: string): Promise<NavigationSession | null> => {
  const docRef = doc(db, 'navigationSessions', sessionId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date()
    } as NavigationSession;
  }
  return null;
};