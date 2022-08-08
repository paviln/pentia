import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from './App';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigate = (name: any, params: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate<keyof RootStackParamList>(name, params);
  }
};
