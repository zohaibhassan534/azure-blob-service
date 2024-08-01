import { BlobServiceClient } from "@azure/storage-blob";

const uploadToAzureBlobStorage = async (
  file,
  id,
  folderName,
  type = "image"
) => {
  // Your Azure Blob Storage account connection string
  const connectionString = import.meta.env
    .VITE_APP_AZURE_STORAGE_CONNECTION_STRING;

  // Name of the container in which you want to store the blob
  const containerName = type === "image" ? "images" : "files";

  // Create a new BlobServiceClient
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Get a block blob client
  const blobName = folderName + "/" + id + "/" + file.name;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    // Upload the file
    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });
    const url = `https://${blobServiceClient.accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    return url;
  } catch (error) {
    return null;
  }
};

async function deleteFileFromAzureBlobStorage(blobName, type = "image") {
  // Create a BlobServiceClient
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    import.meta.env.VITE_APP_AZURE_STORAGE_CONNECTION_STRING
  );

  // Name of the container in which you want to store the blob
  const containerName = type === "image" ? "images" : "files";

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobNameShort = blobName.replace(
    `https://${blobServiceClient.accountName}.blob.core.windows.net/${containerName}/`,
    ""
  );

  // Get a block blob client for the specified blob
  const blobClient = containerClient.getBlobClient(blobNameShort);

  try {
    // Delete the blob
    await blobClient.delete();
    return true;
  } catch (error) {
    return null;
  }
}

export { uploadToAzureBlobStorage, deleteFileFromAzureBlobStorage };
