import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import axios from 'axios';
//import * as Permissions from 'expo-permissions';
//import * as StorageAccessFramework from 'expo-file-system';
import * as FileSystem from 'expo-file-system';


interface FileItem {
  name: string;
  url: string;
}

export default function ViewFilesScreen() {
 // const [files, setFiles] = useState<FileItem[]>([]);
  //const [loading, setLoading] = useState(false);
  const [directoryUri, setDirectoryUri] = useState<string>();

  const pickDirectory = async () => {
    try {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to save files.');
        return;
      }
      setDirectoryUri(permissions.directoryUri); // Store selected folder
      Alert.alert('Success', 'Folder selected for saving files.');
    } catch (error) {
      Alert.alert('Error', 'Failed to select folder');
      console.error('Folder selection error:', error);
    }
  };

  const downloadFile = async () => {
    //console.log('Selected directory URI:', directoryUri);
    //const dir_uri = directoryUri;
    //alert("Downloading file...");
    let downloadURL;
    const fileName='farmpond4.pdf'
    try{
        downloadURL = await axios.get(`http://192.168.1.27:5000/api/download/${fileName}`, {
      });
      console.log('Download URL:', downloadURL.data);
    }
    catch (error) { 
      Alert.alert('Error', 'Failed to get download URL');
      console.error('Error fetching download URL:', error);
      return;
    }
    const tempFileUri = FileSystem.cacheDirectory + 'farmpond.pdf';

    const downloadResumable = FileSystem.createDownloadResumable(
      downloadURL.data,
      tempFileUri,
    );
    console.log('Download Resumable:', downloadResumable);
   try{
    const {uri} = await downloadResumable.downloadAsync();
    //console.log('File downloaded to:', uri);
    //console.log('Temprary file URI:', tempFileUri);

    const info = await FileSystem.getInfoAsync(uri);
    console.log('Downloaded file size:', info); 

    const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });
    console.log("File content preview:", fileContent.slice(0, 500));

    const base64Content = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    // const mimeType = 'application/pdf';
   // const newFileUri = await StorageAccessFramework.StorageAccessFramework.createFileAsync(directoryUri, 'farmpond.pdf', mimeType);

    const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      directoryUri,
      'document.pdf',
      'application/pdf'
    );

    // await FileSystem.copyAsync({
    //   from: tempFileUri,
    //   to: newFileUri,
    // });

    //5. Write base64 content to the created file
    await FileSystem.writeAsStringAsync(newFileUri, base64Content, {
      encoding: FileSystem.EncodingType.Base64,
    });

    Alert.alert('Download complete', `File saved successfully!`);
  }catch (error) {
    console.error('Download failed:', error);
    Alert.alert('Download failed', 'Please try again.');
  }
  };


  return (
    <View style={styles.container}>
       {/* Select Folder Button */}
       <Button title="Select Folder for Downloads" onPress={pickDirectory} />
      <TouchableOpacity onPress={downloadFile}>
        <Text  style={styles.heading}>Download </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 5,
    borderRadius: 8,
  },
});
