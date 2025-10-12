;; StackVerse Profile NFT Contract
;; Manages user profile NFTs with metadata

;; Define the NFT
(define-non-fungible-token profile-nft uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-token-exists (err u102))
(define-constant err-invalid-data (err u103))
(define-constant err-not-authorized (err u104))

;; Data Variables
(define-data-var last-token-id uint u0)
(define-data-var mint-price uint u0) ;; Price in microSTX (0 for free)

;; Data Maps
(define-map profiles 
  uint 
  {
    name: (string-ascii 50),
    bio: (string-utf8 256),
    social-link: (string-utf8 256),
    token-uri: (string-utf8 256),
    creation-date: uint
  }
)

;; Read-only functions
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-mint-price)
  (ok (var-get mint-price))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? profile-nft token-id))
)

(define-read-only (get-profile (token-id uint))
  (ok (map-get? profiles token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (get token-uri (unwrap! (map-get? profiles token-id) (err u404))))
)

;; Public functions
(define-public (create-profile 
  (name (string-ascii 50))
  (bio (string-utf8 256))
  (social-link (string-utf8 256))
  (token-uri (string-utf8 256))
)
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
      (current-price (var-get mint-price))
    )
    ;; Validate inputs
    (asserts! (> (len name) u0) err-invalid-data)
    (asserts! (> (len token-uri) u0) err-invalid-data)
    
    ;; Mint NFT
    (try! (nft-mint? profile-nft token-id tx-sender))
    
    ;; Store profile data
    (map-set profiles token-id {
      name: name,
      bio: bio,
      social-link: social-link,
      token-uri: token-uri,
      creation-date: block-height
    })
    
    ;; Update last token ID
    (var-set last-token-id token-id)
    
    (ok token-id)
  )
)

(define-public (update-profile
  (token-id uint)
  (name (string-ascii 50))
  (bio (string-utf8 256))
  (social-link (string-utf8 256))
)
  (let
    (
      (current-profile (unwrap! (map-get? profiles token-id) err-not-token-owner))
    )
    ;; Check ownership
    (asserts! (is-eq (some tx-sender) (nft-get-owner? profile-nft token-id)) err-not-authorized)
    ;; Validate name
    (asserts! (> (len name) u0) err-invalid-data)
    
    ;; Update profile
    (map-set profiles token-id {
      name: name,
      bio: bio,
      social-link: social-link,
      token-uri: (get token-uri current-profile),
      creation-date: (get creation-date current-profile)
    })
    
    (ok true)
  )
)

(define-public (update-profile-image
  (token-id uint)
  (new-token-uri (string-utf8 256))
)
  (let
    (
      (current-profile (unwrap! (map-get? profiles token-id) err-not-token-owner))
    )
    ;; Check ownership
    (asserts! (is-eq (some tx-sender) (nft-get-owner? profile-nft token-id)) err-not-authorized)
    ;; Validate URI
    (asserts! (> (len new-token-uri) u0) err-invalid-data)
    
    ;; Update URI
    (map-set profiles token-id {
      name: (get name current-profile),
      bio: (get bio current-profile),
      social-link: (get social-link current-profile),
      token-uri: new-token-uri,
      creation-date: (get creation-date current-profile)
    })
    
    (ok true)
  )
)

(define-public (transfer 
  (token-id uint)
  (sender principal)
  (recipient principal)
)
  (begin
    (asserts! (is-eq tx-sender sender) err-not-authorized)
    (nft-transfer? profile-nft token-id sender recipient)
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
