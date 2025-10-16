;; StackVerse Token Contract
;; SIP-010 Fungible Token with rate limiting

;; Define SIP-010 trait locally
(define-trait sip-010-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    (get-name () (response (string-ascii 32) uint))
    (get-symbol () (response (string-ascii 32) uint))
    (get-decimals () (response uint uint))
    (get-balance (principal) (response uint uint))
    (get-total-supply () (response uint uint))
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

;; Define the FT
(define-fungible-token stackverse-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-daily-limit-exceeded (err u104))

;; Token configuration
(define-constant token-name "StackVerse Token")
(define-constant token-symbol "SVT")
(define-constant token-decimals u6)

;; Minting limits
(define-constant max-mint-per-day u10000000) ;; 10 tokens with 6 decimals
(define-constant mint-cooldown u144) ;; ~24 hours in blocks (assuming 10 min blocks)

;; Data Variables
(define-data-var mint-price uint u0) ;; Price in microSTX (0 for free)
(define-data-var total-supply uint u0)

;; Data Maps
(define-map last-mint-block
  principal
  uint
)
(define-map minted-in-period
  principal
  uint
)

;; SIP-010 Standard Functions

(define-read-only (get-name)
  (ok token-name)
)

(define-read-only (get-symbol)
  (ok token-symbol)
)

(define-read-only (get-decimals)
  (ok token-decimals)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance stackverse-token account))
)

(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)

(define-read-only (get-token-uri)
  (ok (some u"https://stackverse.xyz/token-metadata.json"))
)

(define-public (transfer
    (amount uint)
    (sender principal)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (asserts! (> amount u0) err-invalid-amount)
    (try! (ft-transfer? stackverse-token amount sender recipient))
    (match memo
      to-print (print to-print)
      0x
    )
    (ok true)
  )
)

;; Custom Functions

(define-read-only (get-mint-price)
  (ok (var-get mint-price))
)

(define-read-only (get-remaining-mint-allowance (user principal))
  (let (
      (last-mint (default-to u0 (map-get? last-mint-block user)))
      (blocks-passed (- stacks-block-height last-mint))
    )
    (if (>= blocks-passed mint-cooldown)
      (ok max-mint-per-day)
      (ok (- max-mint-per-day (default-to u0 (map-get? minted-in-period user))))
    )
  )
)

(define-public (mint (amount uint))
  (let (
      (last-mint (default-to u0 (map-get? last-mint-block tx-sender)))
      (blocks-passed (- stacks-block-height last-mint))
      (current-period-minted (default-to u0 (map-get? minted-in-period tx-sender)))
    )
    ;; Validate amount
    (asserts! (> amount u0) err-invalid-amount)

    ;; Reset counter if cooldown period has passed
    (if (>= blocks-passed mint-cooldown)
      (begin
        (map-set last-mint-block tx-sender stacks-block-height)
        (map-set minted-in-period tx-sender u0)
      )
      true
    )

    ;; Check daily limit
    (asserts!
      (<= (+ amount (default-to u0 (map-get? minted-in-period tx-sender)))
        max-mint-per-day
      )
      err-daily-limit-exceeded
    )

    ;; Mint tokens
    (try! (ft-mint? stackverse-token amount tx-sender))

    ;; Update tracking
    (map-set last-mint-block tx-sender stacks-block-height)
    (map-set minted-in-period tx-sender
      (+ amount (default-to u0 (map-get? minted-in-period tx-sender)))
    )
    (var-set total-supply (+ (var-get total-supply) amount))

    (ok amount)
  )
)

;; Admin functions
(define-public (set-mint-price (new-price uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set mint-price new-price)
    (ok true)
  )
)

(define-public (admin-mint
    (amount uint)
    (recipient principal)
  )
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> amount u0) err-invalid-amount)
    (try! (ft-mint? stackverse-token amount recipient))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok amount)
  )
)
