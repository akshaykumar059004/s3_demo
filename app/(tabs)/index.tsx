import React, { useState } from "react";
import { View, Button, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
//import fs from "expo-file-system";
import axios from "axios";

import { Buffer } from "buffer";


global.Buffer = Buffer;

export default function UploadScreen() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (result.assets!== null) {  
      Alert.alert("Success", "Document picked successfully.");
    }
    if (!result.canceled) {
      setUploading(true);
      try {
        setFileUrl(result.assets[0].uri);
        //console.log(result.assets[0].uri);
        await uploadDocument(result.assets[0]);
        //console.log("File uploaded successfully");
        //console.info("File uploaded successfully");
        alert("File uploaded successfully");
      } catch (error) {
        Alert.alert("Upload failed", "Please try again.");
        //console.log("Upload error:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadDocument = async (file:DocumentPicker.DocumentPickerAsset) => {
    const uploadURL = await axios.get('http://192.168.1.27:5000/api/upload');
    //console.log("Upload URL (Frontend):",uploadURL.data);
    //const formData = new FormData();
    // formData.append("file", {
    //   uri: file.uri,
    //   name: file.name,
    //   type: "application/pdf",
    // });
    //formData.append("file", file);
    const fileData = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const buffer = Buffer.from(fileData, 'base64');
    //console.log("Buffer:", buffer.BYTES_PER_ELEMENT);
    try {
      const response = await axios.put(uploadURL.data, buffer, {
        headers: {
          'Content-Type': 'application/pdf',
        }
      });
   }
   catch (error) {
      console.error("Upload error:", error);
   }
  module.exports = {
    UploadScreen,
  };
};

  return (
    <View style={styles.container}>
      <Button title="Pick a PDF" onPress={pickDocument} />
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
      {fileUrl ? <Text style={styles.link}>Uploaded File: {fileUrl}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  link: { marginTop: 20, color: "blue", textDecorationLine: "underline" },
});
