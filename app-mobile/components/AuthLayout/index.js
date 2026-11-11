import { KeyboardAvoidingView, Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import Header from '../Header';
import styles from './styles';

export default function AuthLayout({ heading, description, children, scrollRef }) {
  const { width } = useWindowDimensions();
  const wide = Platform.OS === 'web' && width >= 900;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scrollContent, wide && styles.wide]}
        keyboardShouldPersistTaps="handled"
      >
        <Header wide={wide} />
        <View style={[styles.surface, wide && styles.wideSurface]}>
          <View style={styles.form}>
            <View style={styles.intro}>
              <Text accessibilityRole="header" style={styles.heading}>{heading}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            {children}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
