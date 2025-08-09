package com.mtbyown.sugresults

import android.content.ContentValues
import android.content.Context
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileInputStream
import java.io.OutputStream

class SaveResult(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    
    override fun getName(): String {
        return "SaveResult"
    }

    @ReactMethod
    fun saveFileToDownloads(filePath: String, fileName: String, promise: Promise) {
        try {
            val resolver = reactContext.contentResolver
            val contentValues = ContentValues().apply {
                put(MediaStore.Downloads.DISPLAY_NAME, fileName)
                put(MediaStore.Downloads.MIME_TYPE, "application/pdf")
                put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/sugresults")
                put(MediaStore.Downloads.IS_PENDING, 1)
            }

            val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
                ?: throw Exception("Failed to create new MediaStore record")

            val inputStream = FileInputStream(File(filePath))
            val outputStream: OutputStream? = resolver.openOutputStream(uri)

            inputStream.copyTo(outputStream!!)
            outputStream.flush()
            outputStream.close()
            inputStream.close()

            contentValues.clear()
            contentValues.put(MediaStore.Downloads.IS_PENDING, 0)
            resolver.update(uri, contentValues, null, null)

            promise.resolve("File saved to Downloads/$fileName")
        } catch (e: Exception) {
            Log.e("SaveToDownloads", "Error saving file", e)
            promise.reject("SAVE_FAILED", e.message)
        }
    }
}
