package com.mtbyown.sugresults;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import android.util.Log;

import javax.net.ssl.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class CustomModule extends ReactContextBaseJavaModule {

    private static final String TAG = "CustomModule"; // Log tag for debugging

    CustomModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "CustomModule";
    }

    @ReactMethod
    public void GET(String url, Promise promise) {
        try {
            String requestUrl = url != null && !url.isEmpty() ? url : "https://103.57.178.67/S202324/other202324/2.php?Enroll=23017400024"; // Use the passed URL or the default one

            // Disable SSL verification
            disableSSLCertificateChecking();

            // Create a URL object
            URL obj = new URL(requestUrl);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            // Set request method
            con.setRequestMethod("GET");

            // Log the requested URL
            Log.d(TAG, "Requested URL: " + requestUrl);

            // Get response code
            int responseCode = con.getResponseCode();
            Log.d(TAG, "Response Code: " + responseCode);

            // Get the final URL after redirections (if any)
            String responseUrl = con.getURL().toString();
            Log.d(TAG, "Response URL: " + responseUrl);

            // Log all response headers
            Log.d(TAG, "\nResponse Headers:");
            Map<String, List<String>> headers = con.getHeaderFields();
            for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
                Log.d(TAG, entry.getKey() + ": " + entry.getValue());
            }

            // Read response body
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine).append("\n");
            }
            in.close();

            // Log response body
            Log.d(TAG, "\nResponse Body:\n" + response.toString());

        // Create a WritableMap to store response data
        WritableMap data = new WritableNativeMap();
        data.putString("responseBody", response.toString());
        data.putString("requestUrl", requestUrl);
        data.putString("responseUrl", responseUrl);

        // Resolve the promise with the response data
        promise.resolve(data);

        } catch (Exception e) {
            // Log the error and reject the promise with the error
            Log.e(TAG, "Error making GET request", e);
            promise.reject("GET_REQUEST_ERROR", "Error making GET request", e);
        }
    }

    // Function to disable SSL certificate validation
    private static void disableSSLCertificateChecking() {
        try {
            TrustManager[] trustAllCertificates = new TrustManager[] {
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }

                    public void checkClientTrusted(X509Certificate[] certs, String authType) {
                    }

                    public void checkServerTrusted(X509Certificate[] certs, String authType) {
                    }
                }
            };

            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCertificates, new SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // Disable hostname verification
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

        } catch (Exception e) {
            Log.e(TAG, "SSL Error", e);
        }
    }
}
