import { useEffect, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle, Image, Platform, Pressable, Text, View } from 'react-native';
import Icon from '../Icon';
import styles from './styles';

export default function ScreenHeader({ title, subtitle, back, onBack, onLogout, busy, wide }) {
  const heading = useRef(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (Platform.OS === 'web') heading.current?.focus?.();
      else {
        const node = findNodeHandle(heading.current);
        if (node) AccessibilityInfo.setAccessibilityFocus(node);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [title]);
  return <View style={[styles.header, wide && styles.wideHeader]}>
    {back ? <Pressable testID="navigation-back" accessibilityRole="button" accessibilityLabel={`Voltar para ${back}`} onPress={onBack} style={({ pressed, focused }) => [styles.back, focused && styles.focused, pressed && styles.pressed]}>
      <Icon name="back" active light={!wide} /><Text style={[styles.link, wide && styles.wideLink]}>{back}</Text>
    </Pressable> : null}
    <View style={styles.line}>
      {!wide && !back ? <Image source={require('../../assets/planengen-mark.png')} style={styles.mark} resizeMode="contain"
        accessible={false} importantForAccessibility="no" /> : null}
      <View style={styles.copy}>
        <Text ref={heading} tabIndex={Platform.OS === 'web' ? -1 : undefined} accessibilityRole="header" style={[styles.title, wide && styles.wideTitle]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, wide && styles.wideSubtitle]}>{subtitle}</Text> : null}
      </View>
      {onLogout ? <Pressable testID="account-logout" accessibilityRole="button" onPress={onLogout} disabled={busy} style={({ pressed, focused }) => [styles.back, focused && styles.focused, pressed && styles.pressed]}><Text style={[styles.link, wide && styles.wideLink]}>Sair</Text></Pressable> : null}
    </View>
  </View>;
}
