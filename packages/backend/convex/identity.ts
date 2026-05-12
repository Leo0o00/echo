interface UserIdentity {
  tokenIdentifier: string
  issuer: string
  subject: string
  fva: number[]
  o: {
    id: string
    rol: string
    slg: string
  }
  sid: string
  sts: string
  v: number
}
