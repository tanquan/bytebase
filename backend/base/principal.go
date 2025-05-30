package base

// SystemBotID is the ID of the system robot.
const SystemBotID = 1

// AllUsers is the email of the pseudo allUsers account.
const AllUsers = "allUsers"

// PrincipalType is the type of a principal.
type PrincipalType string

const (
	// EndUser is the principal type for END_USER.
	// EndUser represents the human being using Bytebase.
	EndUser PrincipalType = "END_USER"
	// ServiceAccount is the principal type for SERVICE_ACCOUNT.
	// ServiceAcount represents the external service calling Bytebase OpenAPI.
	ServiceAccount PrincipalType = "SERVICE_ACCOUNT"
	// SystemBot is the principal type for SYSTEM_BOT.
	// SystemBot represents the internal system bot performing operations.
	SystemBot PrincipalType = "SYSTEM_BOT"

	// PrincipalIDForFirstUser is the principal id for the first user in workspace.
	PrincipalIDForFirstUser = 101

	// ServiceAccountAccessKeyPrefix is the prefix for service account access key.
	ServiceAccountAccessKeyPrefix = "bbs_"
)
