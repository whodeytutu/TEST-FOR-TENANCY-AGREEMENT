/**
 * Custom signing script for electron-builder
 * This script handles Windows code signing using Azure SignTool or signtool.exe
 * 
 * For cloud signing (Azure Key Vault), set these environment variables:
 * - AZURE_KEY_VAULT_URI: Your Azure Key Vault URI
 * - AZURE_CLIENT_ID: Azure App Registration Client ID
 * - AZURE_CLIENT_SECRET: Azure App Registration Client Secret
 * - AZURE_TENANT_ID: Azure Tenant ID
 * - AZURE_CERT_NAME: Certificate name in Key Vault
 * 
 * For local signing with a PFX file, set:
 * - CSC_LINK: Path to your .pfx certificate file
 * - CSC_KEY_PASSWORD: Password for the certificate
 */

const { execSync } = require('child_process');
const path = require('path');

exports.default = async function sign(configuration) {
  // Skip signing if no signing credentials are provided
  if (!process.env.CSC_LINK && !process.env.AZURE_KEY_VAULT_URI) {
    console.log('⚠️  No signing credentials found. Skipping code signing.');
    console.log('   To enable signing, set CSC_LINK and CSC_KEY_PASSWORD environment variables.');
    return;
  }

  const filePath = configuration.path;
  const fileName = path.basename(filePath);
  
  console.log(`🔏 Signing: ${fileName}`);

  try {
    if (process.env.AZURE_KEY_VAULT_URI) {
      // Azure Key Vault signing (recommended for CI/CD)
      const azureSignToolPath = 'AzureSignTool';
      const command = [
        azureSignToolPath,
        'sign',
        '-kvu', process.env.AZURE_KEY_VAULT_URI,
        '-kvi', process.env.AZURE_CLIENT_ID,
        '-kvs', process.env.AZURE_CLIENT_SECRET,
        '-kvt', process.env.AZURE_TENANT_ID,
        '-kvc', process.env.AZURE_CERT_NAME,
        '-tr', 'http://timestamp.digicert.com',
        '-td', 'sha256',
        '-fd', 'sha256',
        '-v',
        `"${filePath}"`
      ].join(' ');

      execSync(command, { stdio: 'inherit' });
    } else if (process.env.CSC_LINK) {
      // Local PFX certificate signing
      const signtoolPath = 'signtool';
      const command = [
        signtoolPath,
        'sign',
        '/f', `"${process.env.CSC_LINK}"`,
        '/p', `"${process.env.CSC_KEY_PASSWORD}"`,
        '/tr', 'http://timestamp.digicert.com',
        '/td', 'sha256',
        '/fd', 'sha256',
        '/v',
        `"${filePath}"`
      ].join(' ');

      execSync(command, { stdio: 'inherit' });
    }

    console.log(`✅ Successfully signed: ${fileName}`);
  } catch (error) {
    console.error(`❌ Failed to sign: ${fileName}`);
    console.error(error.message);
    
    // Don't fail the build if signing fails in development
    if (process.env.CI) {
      throw error;
    }
  }
};
