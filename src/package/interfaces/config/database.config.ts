export default interface DatabaseConfig{
    getDatabaseHost(): string
    getDatabasePort(): number,
    getDatabaseUser(): string,
    getDatabasePassword(): string,
    getDatabaseName(): string,
}