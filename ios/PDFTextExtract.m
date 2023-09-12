//
//  PDFTextExtract.m
//  RN076StartKit
//
//  Created by Henry on 12/09/2023.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <PDFKit/PDFKit.h>

@interface PDFPickerModule : NSObject <RCTBridgeModule, UINavigationControllerDelegate, UIDocumentPickerDelegate>

@property (nonatomic, strong) RCTPromiseResolveBlock resolve;
@property (nonatomic, strong) RCTPromiseRejectBlock reject;
@property (nonatomic, strong) UIDocumentPickerViewController *documentPicker;

@end

@implementation PDFPickerModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openPDFPicker:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    self.resolve = resolve;
    self.reject = reject;

    self.documentPicker = [[UIDocumentPickerViewController alloc] initWithDocumentTypes:@[(NSString *)kUTTypePDF] inMode:UIDocumentPickerModeOpen];
    self.documentPicker.delegate = self;

    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        [rootViewController presentViewController:self.documentPicker animated:YES completion:nil];
    });
}

RCT_EXPORT_METHOD(extractTextFromPDF:(NSString *)pdfURL
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSURL *url = [NSURL URLWithString:pdfURL];
    if (!url) {
        reject(@"INVALID_URI", @"Invalid PDF file URL", nil);
        return;
    }

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        @try {
            NSData *pdfData = [NSData dataWithContentsOfURL:url];
            PDFDocument *pdfDoc = [[PDFDocument alloc] initWithData:pdfData];
            NSMutableArray *textArray = [NSMutableArray array];

            for (NSInteger pageIndex = 0; pageIndex < pdfDoc.pageCount; pageIndex++) {
                @autoreleasepool {
                    PDFPage *pdfPage = [pdfDoc pageAtIndex:pageIndex];
                    NSString *pageText = [pdfPage string];
//                    NSString *fontFamily = [self detfectFontFamilyForText:pageText];
                    NSDictionary *textInfo = @{
                        @"text": pageText,
//                        @"fontFamilyDetected": fontFamily
                    };
                    [textArray addObject:textInfo];
                }
            }

            dispatch_async(dispatch_get_main_queue(), ^{
                resolve(textArray);
            });
        } @catch (NSException *exception) {
            dispatch_async(dispatch_get_main_queue(), ^{
                reject(@"EXTRACTION_ERROR", @"Error extracting text from PDF", nil);
            });
        }
    });
}

- (NSString *)detectFontFamilyForText:(NSString *)text {
    // Implement logic to detect the font family for the given text.
    // You can use regular expressions or other methods to determine the font.
    // Replace the following line with your font detection logic.
    return @"UnknownFont";
}


- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentsAtURLs:(NSArray<NSURL *> *)urls {
    if (urls.count > 0) {
        NSURL *selectedURL = urls.firstObject;
        self.resolve(selectedURL.absoluteString);
    } else {
        self.reject(@"NO_SELECTION", @"No PDF file selected", nil);
    }
}

- (void)documentPickerWasCancelled:(UIDocumentPickerViewController *)controller {
    self.reject(@"USER_CANCELLED", @"User cancelled document picker", nil);
}

@end