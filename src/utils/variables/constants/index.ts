// Addresses
export const ALLO_CONTRACT_ADDRESS =
	'0x9d0757C6cF366De37aB87128DD82e865F64f766C'
export const ROUND_ADDRESS = '0x9e4c57a662aD052E6F19b8361754f99E50902D22'
export const SCI_ADMIN_ADDRESS = '0x7753E5f36f20B14fFb6b6a61319Eb66f63abdb0b'

// Struct Types
export const ALLOCATE_STRUCT_TYPES: string[] = ['address', 'uint256']
export const INITIALIZE_DATA_STRUCT_TYPES: string[] = [
	'uint256',
	'tuple(bool, bool, uint256, uint64, uint64, uint64, uint64)'
]
export const RECIPIENT_DATA_STRUCT_TYPES: string[] = [
	'address',
	'address',
	'tuple(uint256, string)'
]

// Others
export const FIREBASE_COLLECTION_PROFILES = 'profiles'
export const FIREBASE_COLLECTION_ROUNDS = 'rounds'
export const GAS_LIMIT = 30000000
