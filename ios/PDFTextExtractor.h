//
//  PDFTextExtractor.h
//  RN076StartKit
//
//  Created by Henry on 09/09/2023.
//

#import <Foundation/Foundation.h>

@interface PDFTextExtractor : NSObject

- (void)extractTextFromPickedPDFWithCompletion:(void (^)(NSString *text, NSError *error))completion;

@end

