package com.rn076startkit.Loading;

import android.app.Activity;
import android.app.ProgressDialog;
import android.graphics.drawable.ColorDrawable;

import com.rn076startkit.R;

public final class Loading {
    private static ProgressDialog progressDialog;

    private Loading() {

    }

    public static void show(Activity context) {
        if (context.isFinishing())
            return;
        if (progressDialog != null) {
            if (progressDialog.isShowing()) {
                progressDialog.dismiss();
            }
            progressDialog = null;
        }

        progressDialog = new ProgressDialog(context, R.style.MyProgressDialogTheme);
        progressDialog.setCancelable(false);
        progressDialog.show();
        progressDialog.setContentView(R.layout.progress_custom);
        progressDialog.getWindow().setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
    }

    public static void hide(Activity context) {
        if (progressDialog != null && progressDialog.isShowing() && !context.isFinishing()) {
            progressDialog.dismiss();
        }
    }

}

