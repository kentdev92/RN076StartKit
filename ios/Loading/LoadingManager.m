//
//  LoadingManager.m
//  RN076StartKit
//
//  Created by Henry on 23/03/2023.
//

#import "LoadingManager.h"
#import <SVProgressHUD/SVProgressHUD.h>

@implementation LoadingManager
RCT_EXPORT_MODULE(RNLoading)
RCT_EXPORT_METHOD(showLoading) {
  [SVProgressHUD setDefaultMaskType: SVProgressHUDMaskTypeBlack];
  [SVProgressHUD show];
}

RCT_EXPORT_METHOD(hideLoading) {
  [SVProgressHUD dismiss];
}

@end
