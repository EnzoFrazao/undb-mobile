import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';
import { createDraftStore, draftKey } from './draftStore.cjs';

export const reportDrafts = createDraftStore(AsyncStorage);
export const reportDraftKey = (userId, workId) => draftKey(API_URL, userId, workId);
