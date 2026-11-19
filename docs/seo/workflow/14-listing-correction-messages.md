# 14 Listing correction messages, ready to send (21 Nov 2026)

This is Phase 3 of the live-repo prompt. It turns the open rows dated **2026-11-17** in `docs/geo/corrections-log.csv`, and the fix table in `07-offsite/nap-and-profile-fixes.md`, into one message per platform. The owner sends them from the business login or the platform's support form. **Nothing has been sent.**

## Before sending

1. **Answer D8 first.** Should every listing show **+91 73587 14113** for the restaurant, with 94442 24999 only for catering?
   - If yes, send the messages as written.
   - If no, take the phone lines out of the messages.
2. **Do not touch these until the owner answers:**
   - Justdial "Beyond Curry by Brihadhee" (Q26)
   - delivery or takeaway fields (Q25)
   - any parking field (Q27)
3. **After each fix:**
   - screenshot the corrected field into `docs/seo/workflow/evidence/profiles/`
   - set that row's `status` in `corrections-log.csv` to `fixed`, with the date

**Correct values** (single source: `/about/#facts`)

```
Name:     Brihadhee
Address:  New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road,
          Anna Nagar East, Chennai, Tamil Nadu 600040
Phone:    +91 73587 14113 (restaurant); +91 94442 24999 (catering only)
Hours:    Monday to Sunday, 11 AM to 11 PM. Lunch and dinner only.
Food:     Pure vegetarian. No meat, egg or fish.
Website:  https://www.brihadhee.com/
Menu:     https://www.brihadhee.com/menu/
```

---

### 1. EazyDiner (highest risk: contradicts the pure-veg fact)

> Hello EazyDiner team, I am the owner of Brihadhee, Anna Nagar East, Chennai (https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877). Please correct three details on our page:
> 1. Your FAQ says we serve "both veg and non veg food". Brihadhee is a pure vegetarian restaurant. We serve no meat, egg or fish. Please change the FAQ and the dietary tag.
> 2. Our hours are 11 AM to 11 PM, every day, lunch and dinner only. The page shows 06:30 AM.
> 3. Please add our website: https://www.brihadhee.com/
>
> Our full details are listed at https://www.brihadhee.com/about/#facts. Thank you.

### 2. Zomato

> Hello Zomato team, please update Brihadhee, Anna Nagar East (https://www.zomato.com/chennai/brihadhee-anna-nagar-east):
> 1. Call number: +91 73587 14113 is our restaurant number. +91 94442 24999 is for catering enquiries only.
> 2. Meal highlights: please remove "Breakfast" and "Brunch". We serve lunch and dinner only, 11 AM to 11 PM.
> 3. Website: https://www.brihadhee.com/
>
> Thank you.

### 3. District (Zomato group)

> Hello District team, please update Brihadhee, Anna Nagar East (https://www.district.in/dining/chennai/brihadhee-anna-nagar-east):
> 1. Call number: +91 73587 14113. The number currently shown, +91 94442 24999, is for catering only.
> 2. Hours: 11 AM to 11 PM, every day. Any offer window must fall inside these hours.
> 3. Website: https://www.brihadhee.com/
>
> Thank you.

### 4. magicpin

> Hello magicpin team, please update Brihadhee, Anna Nagar East, Chennai (store 1754057):
> 1. Hours: we are open 11 AM to 11 PM, every day. The page shows 11:30 AM – 2:00 PM.
> 2. Phone: +91 73587 14113.
> 3. Website: https://www.brihadhee.com/
>
> Thank you.

### 5. Swiggy Dineout

> Hello Swiggy Dineout team, please update Brihadhee, Anna Nagar (https://www.swiggy.com/restaurants/brihadhee-anna-nagar-chennai-1150652/dineout):
> 1. Address: New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Tamil Nadu 600040. The page shows "Plot No.41, 3Road Avenue".
> 2. Phone: +91 73587 14113.
> 3. Website: https://www.brihadhee.com/
>
> Thank you.

*Hold the parking line until Q27 is answered.*

### 6. Apple Maps (Apple Business Connect)

Claim the place at businessconnect.apple.com first, then edit it directly:

| Field | Change to |
|---|---|
| Name | **Brihadhee** (not "Brihadhee Pure Veg Restaurant") |
| Address | The full address above |
| Phone | +91 73587 14113 |
| Website | https://www.brihadhee.com/ |
| Hours | 11 AM to 11 PM daily |

The landmark "Opposite Sea Shell" is unverified. Remove it unless the owner confirms it.

### 7. Justdial: the "Brihadhee" listing only (not Beyond Curry)

> Hello Justdial team, I am the owner of Brihadhee, Anna Nagar East, Chennai. Please correct our "Brihadhee" listing:
> 1. Address: New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Tamil Nadu 600040. The listing shows "New Now, 41( Old Now 124".
> 2. Please remove breakfast from the description. We serve lunch and dinner, 11 AM to 11 PM.
> 3. Website: https://www.brihadhee.com/
> 4. Phone: +91 73587 14113
>
> Thank you.

### 8. Bing Places

Import from the Google Business Profile **after** D6 is done. Then check:
- the address includes W-41 / W-124 and W-Block
- the website is https://www.brihadhee.com/
- there are no duplicate listings
