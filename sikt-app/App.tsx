import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle, Rect } from 'react-native-svg';

// Use Animated.View as the background carrier for the button to avoid animating Pressable directly (Hermes freeze bug)

function SiktLogo({ size = 18, color = '#000000' }: { size?: number; color?: string }) {
  const w = size;
  const h = size;
  return (
    <Svg width={w} height={h} viewBox="0 0 1024 1024">
      <Rect x={212} y={362} width={300} height={300} rx={60} ry={60} fill={color} transform="rotate(45 362 512)" />
      <Circle cx={662} cy={512} r={150} fill={color} />
    </Svg>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [showKontroll, setShowKontroll] = useState(false);
  const [showEuCard, setShowEuCard] = useState(false);
  const [isKontrollAnimating, setIsKontrollAnimating] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const avatarGap = 36; // fixed gap to center avatar with tighter spacing

  const now = useMemo(() => new Date(), []);
  const updatedAt = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    return `${day}.${month}.${year} kl. ${hours}:${minutes} (CEST)`;
  }, [now]);

  const runKontrollAnimation = useCallback(() => {
    if (isKontrollAnimating) return;
    setIsKontrollAnimating(true);
    const forward = Animated.timing(colorAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
    const backward = Animated.timing(colorAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
    		// Text animation: fade to white in first 250ms, hold for 500ms, fade back in last 250ms
    const textFadeIn = Animated.timing(textAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
    const textHold = Animated.delay(500);
    const textFadeOut = Animated.timing(textAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
    // Button: quick fade to #B698F2 at start, then fade back at the end
    const buttonFadeIn = Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 180,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
    const buttonFadeOut = Animated.timing(buttonAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    // Start button fade-in immediately
    buttonFadeIn.start();

    const parallel = Animated.parallel([
      Animated.loop(Animated.sequence([forward, backward]), { iterations: 3 }),
      Animated.loop(Animated.sequence([textFadeIn, textHold, textFadeOut]), { iterations: 3 }),
    ]);
    parallel.start(() => {
      // Fade the button back to original color on completion
      buttonFadeOut.start(() => setIsKontrollAnimating(false));
    });
  }, [colorAnim, isKontrollAnimating, textAnim, buttonAnim]);
  const onShowEu = useCallback(() => setShowEuCard(true), []);

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={styles.safeTopArea}>
          <StatusBar style="dark" backgroundColor="#F3E2FD" translucent={false} />
        </SafeAreaView>
        <SafeAreaView edges={['left','right','bottom']} style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text>Loading…</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const animatedCardBackground = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#c6f5df', '#7ABD9E', '#106A42'],
  });
  const headerTextColor = textAnim.interpolate({ inputRange: [0, 1], outputRange: [colors.textDark, '#F7FAF8'] });
  const subTextColor = textAnim.interpolate({ inputRange: [0, 1], outputRange: [colors.textMuted, '#F7FAF8'] });
  const expireTextColor = textAnim.interpolate({ inputRange: [0, 1], outputRange: [colors.textDark, '#F7FAF8'] });
  const buttonBackgroundColor = buttonAnim.interpolate({ inputRange: [0, 1], outputRange: [colors.purple, '#B698F2'] });

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} style={styles.safeTopArea}>
        <StatusBar style="dark" backgroundColor="#F3E2FD" translucent={false} />
        <TopBar />
      </SafeAreaView>
      <SafeAreaView edges={['left','right','bottom']} style={styles.container}>
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: avatarGap }]}> 
        {/* Profile avatar */}
        <View style={[styles.avatarWrap, { marginBottom: avatarGap, marginTop: 0 }]}> 
          <Image
            source={require('./assets/avatar.jpg')}
            style={styles.avatar}
          />
        </View>

        {/* Purple Student Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.nameText}>Simon Ishoel (23)</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={16} color="#1a1a1a" />
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Fødselsdato:</Text> 24.01.2002</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="badge" size={16} color="#1a1a1a" />
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Studentnummer:</Text> 557345</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="school" size={16} color="#1a1a1a" />
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Studiested:</Text> Norges teknisk-naturvitenskapelige universitet</Text>
          </View>
        </View>

        {/* Green validity card */}
        <Animated.View style={[styles.validityCard, { backgroundColor: animatedCardBackground }]}>
          <Animated.Text style={[styles.validHeader, { color: headerTextColor }]}>Gyldig studentbevis</Animated.Text>
          <Animated.Text style={[styles.validSub, { color: subTextColor }]}>Vår 2025</Animated.Text>
          <Animated.Text style={[styles.validExpire, { color: expireTextColor }]}><Text style={styles.bold}>Utløper:</Text> 31.08.2025</Animated.Text>
        </Animated.View>

        {/* Buttons */}
        <Pressable onPress={runKontrollAnimation} disabled={isKontrollAnimating} style={({ pressed }) => [styles.primaryButton, (pressed || isKontrollAnimating) && { opacity: 0.9 }]}>
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject as any, { backgroundColor: buttonBackgroundColor, borderRadius: 21 }]} />
          <Text style={styles.primaryButtonText}>Kontroll</Text>
        </Pressable>

        <Pressable onPress={onShowEu} style={({ pressed }) => [styles.outlineButton, pressed && { opacity: 0.9 }]}>
          <View style={styles.outlineInner}>
            <Text style={styles.outlineText}>Europeisk studentbevis</Text>
            <Ionicons name="qr-code" size={16} color="#000000" style={{ marginLeft: 7 }} />
          </View>
        </Pressable>

        {/* Footer metadata */}
        <View style={styles.metaWrap}>
          <Text style={styles.metaText}>Sist oppdatert: {updatedAt}</Text>
          <Text style={styles.metaText}>Tidssone: Europe/Oslo</Text>
          <Text style={styles.metaText}>Versjon: 4.1.8</Text>
        </View>

        {/* Kontroll modal */}
        <Modal visible={showKontroll} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Kontroll</Text>
              <Text style={styles.modalBody}>Dette simulerer kontroll av studentbeviset. Alt ser bra ut.</Text>
              <Pressable onPress={() => setShowKontroll(false)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>Lukk</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* European student card modal */}
        <Modal visible={showEuCard} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Europeisk studentbevis</Text>
              <View style={{ alignItems: 'center', marginTop: 12 }}>
                <Ionicons name="qr-code" size={160} color="#1a1a1a" />
              </View>
              <Pressable onPress={() => setShowEuCard(false)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>Lukk</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TopBar() {
  return (
    <View style={styles.headerBar}>
      <View style={styles.headerLeft}>
        <View style={styles.logoCircle}>
          <Image source={require('./assets/sikt-web-logo.png')} style={styles.headerLogoImage} resizeMode="contain" />
        </View>
      </View>
      <Ionicons name="ellipsis-vertical" size={20} color={colors.purple} />
    </View>
  );
}

const colors = {
  background: '#f6f2fd',
  purple: '#6b4eff',
  purpleCard: '#F4E2FE',
  greenCard: '#c6f5df',
  textDark: '#1a1a1a',
  textMuted: '#5a5a5a',
  outline: '#c9b9ff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeTopArea: {
    backgroundColor: '#F3E2FD',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerBar: {
    height: 60,
    width: '100%',
    backgroundColor: '#F3E2FD',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#8665B9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 97,
    height: 44,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
  },
  headerLogoImage: {
    width: 89,
    height: 28,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.textDark,
  },
  avatarWrap: {
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileCard: {
    backgroundColor: colors.purpleCard,
    borderColor: '#8665b9',
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    gap: 7,
  },
  nameText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.textDark,
  },
  infoLabel: {
    fontFamily: 'Inter_600SemiBold',
  },
  validityCard: {
    backgroundColor: colors.greenCard,
    borderRadius: 12,
    padding: 16,
    marginTop: 14,
    borderWidth: 2,
    borderColor: '#7bd1a9',
    alignItems: 'center',
  },
  validHeader: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 3,
    textAlign: 'center',
  },
  validSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 5,
    textAlign: 'center',
  },
  bold: {
    fontFamily: 'Inter_600SemiBold',
  },
  validExpire: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.textDark,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.purple,
    borderRadius: 21,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  buttonPressable: {
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: 'white',
    fontSize: 14,
  },
  outlineButton: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.outline,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },
  outlineInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#000000',
  },
  metaWrap: {
    marginTop: 20,
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 8,
    color: colors.textDark,
  },
  modalBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  modalClose: {
    marginTop: 16,
    backgroundColor: colors.purple,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
});
