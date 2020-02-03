//@ts-ignore
import { RNS3 } from 'react-native-aws3';

const S3Handler = {
  uploadImageToS3(
    imageLocalUrl: string,
    fileName: string,
    success: Function,
    failure: Function,
    random: string
  ) {
    const file = {
      uri: imageLocalUrl,
      name: fileName,
      type: 'image/jpeg'
    };
    const options = {
      keyPrefix: 'chatApp',
      bucket: 'appinventiv-development',
      region: "us-east-1",
      accessKey: "AKIAJ3UHQTWRRT2AH3RA",
      secretKey: "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",
      successActionStatus: 201
    };

    // self = this;
    RNS3.put(file, options)
      .then((response: any) => {
        if (response.status === 201) {
          success(response.body.postResponse.location, random);
        }
      })
      .catch((error: any) => {
        failure(error);
      });
  }
};

export default S3Handler;
