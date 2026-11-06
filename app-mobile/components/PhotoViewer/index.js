import { useRef, useState } from 'react';
import { Image, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../ActionButton';
import styles, { imageSize } from './styles';

export default function PhotoViewer({ photos, index, onChange, onClose }) {
  const [zoomed, setZoomed] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const lastTap = useRef(0);
  const photo = photos[index];
  const nativePinch = Platform.OS === 'ios';
  function move(next) {
    setZoomed(false);
    onChange(next);
  }
  function doubleTap() {
    const now = Date.now();
    if (now - lastTap.current < 300) setZoomed((value) => !value);
    lastTap.current = now;
  }
  return <Modal visible={Boolean(photo)} onRequestClose={onClose}>
    {photo ? <SafeAreaView style={styles.screen} accessibilityViewIsModal>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.caption}>{photo.label}</Text>
        <ActionButton label="Fechar" icon="close" accessibilityLabel="Fechar visualizador de fotos" secondary onPress={onClose} />
      </View>
      <View style={styles.body} onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setSize((previous) => width === previous.width && height === previous.height ? previous : { width, height });
      }}>
        {nativePinch ? <ScrollView key={photo.id} style={styles.scroll} centerContent minimumZoomScale={1} maximumZoomScale={3} bouncesZoom>
          <Image source={{ uri: photo.uri }} accessibilityLabel={photo.label} style={imageSize(size, false)} resizeMode="contain" />
        </ScrollView> : <ScrollView key={`${photo.id}:${zoomed}`} nestedScrollEnabled style={styles.scroll} scrollEnabled={zoomed}>
          <ScrollView horizontal nestedScrollEnabled scrollEnabled={zoomed}>
            <Pressable accessible={false} tabIndex={-1} onPress={doubleTap}>
              <Image source={{ uri: photo.uri }} accessibilityLabel={photo.label} style={imageSize(size, zoomed)} resizeMode="contain" />
            </Pressable>
          </ScrollView>
        </ScrollView>}
      </View>
      <View style={styles.footer}>
        <ActionButton label="Anterior" secondary disabled={index === 0} onPress={() => move(index - 1)} />
        {!nativePinch ? <ActionButton label={zoomed ? 'Reduzir foto' : 'Ampliar foto'} secondary onPress={() => setZoomed(!zoomed)} /> : null}
        <ActionButton label="Próxima" secondary disabled={index === photos.length - 1} onPress={() => move(index + 1)} />
      </View>
    </SafeAreaView> : null}
  </Modal>;
}
