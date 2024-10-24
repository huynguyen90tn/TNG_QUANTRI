// src/services/api/projectApi.js
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const projectsCollection = collection(db, "projects");

export const getProjects = async () => {
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
};

export const createProject = async (projectData) => {
  const docRef = await addDoc(projectsCollection, projectData);
  return { id: docRef.id, ...projectData };
};

export const updateProject = async (projectId, projectData) => {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, projectData);
  return { id: projectId, ...projectData };
};

export const deleteProject = async (projectId) => {
  const projectRef = doc(db, "projects", projectId);
  await deleteDoc(projectRef);
};

export const getProjectById = async (projectId) => {
  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);
  if (projectSnap.exists()) {
    return { id: projectSnap.id, ...projectSnap.data() };
  } else {
    throw new Error("Project not found");
  }
};
