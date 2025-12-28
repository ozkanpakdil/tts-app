# TTS Provider Pricing Information

This document provides a breakdown of the pricing for various Text-to-Speech providers. This information is used by the in-app Price Calculator to help users choose the best option.

## 1. On-Device TTS (Recommended)
- **Cost**: FREE
- **Provider**: Apple (AVSpeechSynthesizer) / Google (Android TTS)
- **Limits**: No character limits, works offline.
- **Pros**: Completely free, no internet required, low latency.
- **Cons**: Voice quality may be lower than neural cloud voices, fewer voice options.

## 2. Amazon Polly
Amazon Polly offers multiple tiers of pricing based on the voice quality.

| Tier | Price per 1 Million Characters | Free Tier (Monthly) |
|------|--------------------------------|---------------------|
| Standard Voices | $4.00 | 5 Million characters (12 months) |
| Neural Voices | $16.00 | 1 Million characters (12 months) |
| Long-form Voices | $100.00 | None |

## 3. Google Cloud Text-to-Speech
Google Cloud pricing depends on the type of voice model used.

| Tier | Price per 1 Million Characters | Free Tier (Monthly) |
|------|--------------------------------|---------------------|
| Standard Voices | $4.00 | 4 Million characters |
| WaveNet Voices | $16.00 | 1 Million characters |
| Neural2 Voices | $16.00 | 1 Million characters |
| Studio Voices | $160.00 | None |

## 4. Azure Cognitive Services (Speech)
Azure pricing is competitive and includes a generous free tier.

| Tier | Price per 1 Million Characters | Free Tier (Monthly) |
|------|--------------------------------|---------------------|
| Standard (Neural) | $15.96 | 0.5 Million characters |
| Professional (Neural) | Custom | N/A |

*Note: Azure often offers 5 hours of audio free per month in their Free F0 tier.*

## 5. Price Calculator Logic
The app calculates the estimated cost as follows:
`Total Cost = (Estimated Characters / 1,000,000) * Price_per_1M_Characters`

Users can input their expected monthly character usage to see a comparison across all providers.

---
*Prices are accurate as of December 2025. Always check the official provider websites for the most current pricing.*
