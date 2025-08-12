import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [showKontroll, setShowKontroll] = useState(false);
  const [showEuCard, setShowEuCard] = useState(false);

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

  const onShowKontroll = useCallback(() => setShowKontroll(true), []);
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

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} style={styles.safeTopArea}>
        <StatusBar style="dark" backgroundColor="#F3E2FD" translucent={false} />
        <TopBar />
      </SafeAreaView>
      <SafeAreaView edges={['left','right','bottom']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
        {/* Profile avatar */}
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/160?img=12' }}
            style={styles.avatar}
          />
        </View>

        {/* Purple Student Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.nameText}>Even Martin Ab elseth Riksheim (23)</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={18} color="#1a1a1a" />
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Fødselsdato:</Text> 24.09.2001</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="badge" size={18} color="#1a1a1a" />
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Studentnummer:</Text> 599264</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="school" size={18} color="#1a1a1a" />
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Studiested:</Text> Norges teknisk-naturvitenskapelige universitet</Text>
          </View>
        </View>

        {/* Green validity card */}
        <View style={styles.validityCard}>
          <Text style={styles.validHeader}>Gyldig studentbevis</Text>
          <Text style={styles.validSub}>Vår 2025</Text>
          <Text style={styles.validExpire}><Text style={styles.bold}>Utløper:</Text> 31.08.2025</Text>
        </View>

        {/* Buttons */}
        <Pressable onPress={onShowKontroll} style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.9 }]}>
          <Text style={styles.primaryButtonText}>Kontroll</Text>
        </Pressable>

        <Pressable onPress={onShowEu} style={({ pressed }) => [styles.outlineButton, pressed && { opacity: 0.9 }]}>
          <View style={styles.outlineInner}>
            <Text style={styles.outlineText}>Europeisk studentbevis</Text>
          </View>
        </Pressable>

        {/* Footer metadata */}
        <View style={styles.metaWrap}>
          <Text style={styles.metaText}>Sist oppdatert: {updatedAt}</Text>
          <Text style={styles.metaText}>Tidssone: Europe/Oslo</Text>
          <Text style={styles.metaText}>Versjon: 4.1.8</Text>
        </View>
        </ScrollView>

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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TopBar() {
  return (
    <View style={styles.headerBar}>
      <View style={styles.headerLeft}>
        <View style={styles.logoCircle}>
          <Ionicons name="infinite" size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Sikt</Text>
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
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.textDark,
  },
  avatarWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
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
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  nameText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  infoLabel: {
    fontFamily: 'Inter_600SemiBold',
  },
  validityCard: {
    backgroundColor: colors.greenCard,
    borderRadius: 14,
    padding: 18,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#7bd1a9',
    alignItems: 'center',
  },
  validHeader: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  validSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
    textAlign: 'center',
  },
  bold: {
    fontFamily: 'Inter_600SemiBold',
  },
  validExpire: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.purple,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: 'white',
    fontSize: 16,
  },
  outlineButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.outline,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 12,
    backgroundColor: 'white',
  },
  outlineInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.purple,
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
