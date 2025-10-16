# gym.fun - Mobilna Gra Clicker

Prosta aplikacja webowa w Next.js zoptymalizowana pod urządzenia mobilne. To clicker, w którym gracz klika przycisk "Pump" aby zdobywać punkty i awansować na wyższe poziomy.

## 🎮 Opis Gry

- **Mechanika**: Klikaj przycisk "Pump" aby zdobywać +1 punkt XP
- **System Leveli**: Każdy poziom wymaga więcej punktów (wzrost o 15% dla każdego kolejnego levelu)
- **Decay System**: Punkty spadają w czasie (-0.5 XP/sekundę) - nie przestawaj pompować!
- **Awans**: Po osiągnięciu wymaganych punktów gracz awansuje do następnego poziomu

## 🚀 Uruchomienie

```bash
# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev

# Otwórz http://localhost:3000 w przeglądarce
```

## 📱 Funkcjonalności

### ✅ Zaimplementowane
- **Interfejs mobilny** - zoptymalizowany pod telefony
- **System leveli** z algorytmem wzrostu: `XP_n = baseXP * (1 + growthRate)^(n-1)`
- **Pasek postępu** z animacjami
- **Efekty wizualne** - animacje kliknięć i level up
- **Liczniki** - aktualny level i punkty
- **Responsywność** - działa na różnych rozmiarach ekranów

### 🔧 Konfiguracja
- **BASE_XP**: 100 (bazowa ilość punktów dla pierwszego levelu)
- **GROWTH_RATE**: 0.15 (15% wzrost dla każdego kolejnego levelu)
- **DECAY_RATE**: 0.5 (punkty tracone na sekundę)

## 🎯 Mechanika Gry

1. **Kliknij "PUMP"** - zdobywasz +1 XP
2. **Pasek postępu** - pokazuje postęp do następnego levelu
3. **Decay** - punkty spadają w czasie, więc musisz ciągle klikać
4. **Level Up** - po osiągnięciu wymaganych punktów awansujesz
5. **Reset** - po 5 sekundach bez aktywności pasek resetuje się do zera

## 🛠 Technologie

- **Next.js 15** - React framework
- **TypeScript** - typowanie
- **CSS Modules** - stylizacja
- **Coinbase OnchainKit** - integracja z blockchain (przygotowane na przyszłość)

## 📁 Struktura Projektu

```
app/
├── page.tsx              # Główny komponent gry
├── page.module.css       # Style CSS
├── components/
│   └── GameEffects.tsx    # Efekty wizualne
├── types.d.ts            # Deklaracje typów
└── globals.css           # Globalne style
```

## 🎨 Design

- **Gradient tło** - niebiesko-fioletowy
- **Przycisk PUMP** - duży, okrągły, z animacjami
- **Pasek postępu** - z efektem shimmer
- **Animacje** - level up, zdobywanie XP, aktywność
- **Responsywność** - dostosowany do różnych ekranów

## 🔮 Przyszłe Rozszerzenia

Projekt jest przygotowany do integracji z:
- **Ethereum Layer2** - minting tokenów za poziomy
- **NFT** - unikalne osiągnięcia
- **DeFi** - staking i yield farming
- **Social Features** - rankingi i wyzwania

## 🚀 Deployment

```bash
# Build produkcyjny
npm run build

# Uruchom w trybie produkcyjnym
npm start
```

Aplikacja jest gotowa do wdrożenia na Vercel, Netlify lub innych platformach hostingowych.

## 📊 Algorytm Leveli

```typescript
// Wzór na wymagane punkty dla levelu n:
XP_n = baseXP * (1 + growthRate)^(n-1)

// Przykład:
// Level 1: 100 XP
// Level 2: 115 XP (100 * 1.15^1)
// Level 3: 132 XP (100 * 1.15^2)
// Level 4: 152 XP (100 * 1.15^3)
```

## 🎮 Jak Grać

1. Otwórz aplikację na telefonie
2. Klikaj duży przycisk "PUMP" na środku ekranu
3. Obserwuj jak pasek postępu rośnie
4. Nie przestawaj klikać - punkty spadają w czasie!
5. Po osiągnięciu wymaganych punktów awansujesz do następnego levelu
6. Każdy kolejny level wymaga więcej punktów

**Powodzenia w pompowaniu! 💪**