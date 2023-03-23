package com.rn076startkit.Loading;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class LoadingModule extends ReactContextBaseJavaModule {
    public LoadingModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "LoadingModule";
    }

    @ReactMethod
    public void showLoading() {
        Loading.show(getCurrentActivity());
    }

    @ReactMethod
    public void hideLoading() {
        Loading.hide(getCurrentActivity());
    }
}
