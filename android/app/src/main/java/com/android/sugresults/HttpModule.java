package com.android.sugresults;  // Package name corresponds to your folder structure

import android.os.Bundle;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.RequestBody;
import okhttp3.MediaType;
import java.io.IOException;
import java.security.cert.X509Certificate;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.net.ssl.SSLSocketFactory;

public class HttpModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    HttpModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "HttpModule";
    }

    @ReactMethod
    public void getRequest(String url, Callback successCallback, Callback errorCallback) {
        try {
            // Create an insecure SSL context
            SSLContext sslContext = SSLContext.getInstance("TLS");
            TrustManager[] trustAllCertificates = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                }
            };
            sslContext.init(null, trustAllCertificates, new java.security.SecureRandom());
            SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            // Set the OkHttpClient with the insecure SSLContext
            OkHttpClient client = new OkHttpClient.Builder()
                    .sslSocketFactory(sslSocketFactory)
                    .hostnameVerifier((hostname, session) -> true)
                    .build();

            // Create the GET request
            Request request = new Request.Builder()
                    .url(url)
                    .build();

            // Perform the request asynchronously
            client.newCall(request).enqueue(new okhttp3.Callback() {
                @Override
                public void onFailure(okhttp3.Call call, IOException e) {
                    errorCallback.invoke(e.getMessage());
                }

                @Override
                public void onResponse(okhttp3.Call call, Response response) throws IOException {
                    if (response.isSuccessful()) {
                        successCallback.invoke(response.body().string());
                    } else {
                        errorCallback.invoke("Request failed with status code: " + response.code());
                    }
                }
            });
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void postRequest(String url, String jsonBody, Callback successCallback, Callback errorCallback) {
        try {
            // Create an insecure SSL context
            SSLContext sslContext = SSLContext.getInstance("TLS");
            TrustManager[] trustAllCertificates = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                }
            };
            sslContext.init(null, trustAllCertificates, new java.security.SecureRandom());
            SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            // Set the OkHttpClient with the insecure SSLContext
            OkHttpClient client = new OkHttpClient.Builder()
                    .sslSocketFactory(sslSocketFactory)
                    .hostnameVerifier((hostname, session) -> true)
                    .build();

            // Create the POST request
            RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), jsonBody);
            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();

            // Perform the request asynchronously
            client.newCall(request).enqueue(new okhttp3.Callback() {
                @Override
                public void onFailure(okhttp3.Call call, IOException e) {
                    errorCallback.invoke(e.getMessage());
                }

                @Override
                public void onResponse(okhttp3.Call call, Response response) throws IOException {
                    if (response.isSuccessful()) {
                        successCallback.invoke(response.body().string());
                    } else {
                        errorCallback.invoke("Request failed with status code: " + response.code());
                    }
                }
            });
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}
