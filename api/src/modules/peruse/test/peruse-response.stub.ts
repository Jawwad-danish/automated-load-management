import { PeruseJobStatus } from '@module-persistence';
import {
  PeruseDocumentClassifications,
  InformationExtractionResult,
  PeruseClassificationResult,
  RateConfirmationResult,
  PeruseJobType,
} from '../data';

export const buildStubPeruseClassificationResult = (
  data?: Partial<PeruseClassificationResult>,
): PeruseClassificationResult => {
  const result = new PeruseClassificationResult({
    jobId: '6697c014-8a92-4410-825b-80a805f03f28',
    jobType: PeruseJobType.Classification,
    status: 'success' as PeruseJobStatus,
    input: {
      document: {
        externalId: '71ef3594-4dd4-4391-9fd4-13d15ddea72b',
        url: 'https://lm-dev-loads-emails.s3.us-east-1.amazonaws.com/attachments/eo25f0la4go49vsall22lrlqr0spbmmnv25hi9o1_BOBTAIL_5588625_f3c24f73-2c21-4152-86c5-b2ae0bf47e45_cdpc4BTg4f.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAVYRXZV7PYTMRNIM6%2F20240717%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240717T125859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECUaCXVzLWVhc3QtMSJGMEQCIAw1LmOv%2BqbkbHTnVk4uRrbXsqj0UIOyMpMTtPb3ONMyAiA92r9topLHE%2F24lda8MU58qzBovJM0ptlQdS0n7SU%2FpiqYAwju%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAIaDDM5NjMyNzc1OTgzOSIM7PLlLclGiHAsey7iKuwCXCAErjSy9C%2FIEcJP35B%2FvGR7mzOVG5tZ62NZo2r%2BGPNFVhFP32nV67OYSXQk6e7IsHX0bEg5EjtorKkxkyL7IkBSzEXSMLKvpC8ChfkyupAV4Mpi7s8GKVvIcsKQtV%2F0eAjyzf%2BNOpoeDIt%2BT6pJgwzAWev4pOVdKJWBXBIcJ5l%2By6u3Ybzv3lTtSV0V9hXBYidkYfuJ4UCPXgYlx4ftQqt2uZsz2xoujlNIe5np%2BjBXziIvbuJ%2BzmxbaAIbhm%2FXqy5PSIgGMXvf29P3BWkLNYBimR%2FI7ckQXcfsm4wM7TQk%2FUeHA6QKR1bSUbCZRmlLy2fO92gN2i6z2NClRGGD1Bmgc5o8I%2Fqv0OUkpDFVn%2FNfFhJvoyM41uh1BbdW10r%2B%2FVpDqy8Oi9xvo%2BaIH9X4mXdd%2FUq9aDbfCQ3zYUtFCtDB1F7%2BiF%2F5%2BSQJf8picPCUWC6jk2r2Iuc4uyUmeyeXHWV7rUHe%2B1NuZ7Dn3DCTgN%2B0BjqnAWxJWYvShvooUabfPamaemIbw4wTvsqJucDC98DyRz5AEwhw29GNdzzmkbd2qEQJJNVBiddmMhdB8CiYZUr%2Fk65pv2pn3C2xLtjG5tGQaaGEUZ7OxQESYfriD0BWwSXh%2FXoNsUD%2FChYpR9J31H9mM4SAdFOoDlnW32DwbSlXwAHeMOX1JPgxCd%2FqgFeTPiIOL%2FWAQjt%2FFyCVO6vkrhq2wprv0FfvtEDx&X-Amz-Signature=8b2eed1dcaf3bd2057730d2d447a6c8682b65020e0171b5d340f61461ecdeebd&X-Amz-SignedHeaders=host&x-id=GetObject',
      },
      extract: true,
      callbackUrl:
        'https://8bb8-188-24-117-242.ngrok-free.app/peruse/attachment-callback',
      processingConfigOverride: {
        autoSplit: false,
      },
    },
    result: {
      ocrUrls: [
        'https://peruse-staging-ocr-output.s3.us-west-2.amazonaws.com/bobtail/api/6697c014-8a92-4410-825b-80a805f03f28/71ef3594-4dd4-4391-9fd4-13d15ddea72b.pdf.page_1.png.ocr.json?X-Amz-Security-Token=IQoJb3JpZ2luX2VjECUaCXVzLXdlc3QtMiJHMEUCIG20M1PX5VEecKMFuW%2Fwm6eVyPC50%2B9oowi23JljnhPIAiEA4IeBWwRakYXI2NpMPM1GqFBYzGnSNf6GHyOa1xYU0cYqhgQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw0ODgwMDAxNDY4MzMiDA9sraogEXj7nMyAcCraAzEOspJT%2FJIBgCVaA2FpmmwjnIFRQ7ijRLZUINMqHTcp8vdMo%2BZqrVB607fLI%2FeGsqzXD1bpWqEH08%2FUCe8ENCM0GGhl5H67LA6oN5mpDNmXuEeUjpqsVui3Evt9o07t9TpHtyQ%2B8k1e%2FdGuHr%2BJB%2BcaTxrHnwOtG5hu2K%2FbBbJzNJpU%2F1F8JVtwAVp3zsKNhmQ3VwIR2UpRoDOpP04PjEWKGaUr94LdC4RDT4L77uHY4GDBbFVDTo6E0W7gfuEgwPdbGfmw3eFT0zEW1iTA%2BdSTi1HgSXSDF%2BsTJ8RSY0Hx6IPwCoBLDgZicORv39gqvt5fFdJZINg2xD00MtBJNqBFtAoU11m1OiDIjy2O498azQBV12uyyDab1kGE0BL%2BE70JZG3fp1kHadXQZzmzIQoIiYe7CIfaqvhGVEVyT5QPpBnbxBfXd%2B3bAsAsjj2NMs2bLTcvPL04iofydKDoADT%2BjCO0WoqsO7hVeBv5seFKq3sEi1dvW0J9EKFXsIbs1WiLLiV8%2BRfQ%2BvR6yVbRCoCeZhwktR6lexlD0cuWEjLUqBcALrFXQE9B1C6cU5StgH7Mjfnh5CUPJ70ya0WCg6pD%2B1QqEli1S07OQcbW4A6tTK26%2FIRKNKJ3KjCO7d60BjqlAXydsOLI2rt6z%2FNbZtDqGjj1Z7pd1zVQxSlQFCpx2GCGS2WgHrk0SSb3KT0y9SutHbo8mE03NHyPeAyLaal29mMPc6bK5wi4ngKLCyE7Y3NsQBgg9wql45PQJZe2nj%2FGAO7lGP9SkpC0nIS0RooGa5QK4cNhpmDYZDM8%2FVewSUXr%2FSVY7X8meL3G5ZdfBtxYZAeNYvEQVULT%2BGcBFUqsFfupd%2FPEGQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240717T125913Z&X-Amz-SignedHeaders=host&X-Amz-Expires=600&X-Amz-Credential=ASIAXDHYTJWI3QZ7AHMK%2F20240717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=cb6d8f6f043bf2d9a8d5d3fca8d9dc31237a58d8ff558c957e8a09fd62c89984',
        'https://peruse-staging-ocr-output.s3.us-west-2.amazonaws.com/bobtail/api/6697c014-8a92-4410-825b-80a805f03f28/71ef3594-4dd4-4391-9fd4-13d15ddea72b.pdf.page_2.png.ocr.json?X-Amz-Security-Token=IQoJb3JpZ2luX2VjECUaCXVzLXdlc3QtMiJHMEUCIG20M1PX5VEecKMFuW%2Fwm6eVyPC50%2B9oowi23JljnhPIAiEA4IeBWwRakYXI2NpMPM1GqFBYzGnSNf6GHyOa1xYU0cYqhgQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw0ODgwMDAxNDY4MzMiDA9sraogEXj7nMyAcCraAzEOspJT%2FJIBgCVaA2FpmmwjnIFRQ7ijRLZUINMqHTcp8vdMo%2BZqrVB607fLI%2FeGsqzXD1bpWqEH08%2FUCe8ENCM0GGhl5H67LA6oN5mpDNmXuEeUjpqsVui3Evt9o07t9TpHtyQ%2B8k1e%2FdGuHr%2BJB%2BcaTxrHnwOtG5hu2K%2FbBbJzNJpU%2F1F8JVtwAVp3zsKNhmQ3VwIR2UpRoDOpP04PjEWKGaUr94LdC4RDT4L77uHY4GDBbFVDTo6E0W7gfuEgwPdbGfmw3eFT0zEW1iTA%2BdSTi1HgSXSDF%2BsTJ8RSY0Hx6IPwCoBLDgZicORv39gqvt5fFdJZINg2xD00MtBJNqBFtAoU11m1OiDIjy2O498azQBV12uyyDab1kGE0BL%2BE70JZG3fp1kHadXQZzmzIQoIiYe7CIfaqvhGVEVyT5QPpBnbxBfXd%2B3bAsAsjj2NMs2bLTcvPL04iofydKDoADT%2BjCO0WoqsO7hVeBv5seFKq3sEi1dvW0J9EKFXsIbs1WiLLiV8%2BRfQ%2BvR6yVbRCoCeZhwktR6lexlD0cuWEjLUqBcALrFXQE9B1C6cU5StgH7Mjfnh5CUPJ70ya0WCg6pD%2B1QqEli1S07OQcbW4A6tTK26%2FIRKNKJ3KjCO7d60BjqlAXydsOLI2rt6z%2FNbZtDqGjj1Z7pd1zVQxSlQFCpx2GCGS2WgHrk0SSb3KT0y9SutHbo8mE03NHyPeAyLaal29mMPc6bK5wi4ngKLCyE7Y3NsQBgg9wql45PQJZe2nj%2FGAO7lGP9SkpC0nIS0RooGa5QK4cNhpmDYZDM8%2FVewSUXr%2FSVY7X8meL3G5ZdfBtxYZAeNYvEQVULT%2BGcBFUqsFfupd%2FPEGQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240717T125913Z&X-Amz-SignedHeaders=host&X-Amz-Expires=600&X-Amz-Credential=ASIAXDHYTJWI3QZ7AHMK%2F20240717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=5c404515cff920e3ffefc2cca108acee32b965fcabf99dbaedc7b38d192e5121',
      ],
      message: '',
      status: 'success',
      classificationResult: {
        page_1: {
          probabilities: [
            {
              category: PeruseDocumentClassifications.RateConfirmation,
              confidence: 0.5513412914988022,
              rawProb: 0.5513412914988022,
            },
            {
              category: PeruseDocumentClassifications.Lumper,
              confidence: 0.09314402299991052,
              rawProb: 0.09314402299991052,
            },
            {
              category: PeruseDocumentClassifications.NoticeOfAssignment,
              confidence: 0.08665839920766848,
              rawProb: 0.08665839920766848,
            },
            {
              category: PeruseDocumentClassifications.CarrierInvoice,
              confidence: 0.08651178814784558,
              rawProb: 0.08651178814784558,
            },
            {
              category: PeruseDocumentClassifications.Scales,
              confidence: 0.07032485293577832,
              rawProb: 0.07032485293577832,
            },
          ],
          status: 'success',
        },
        page_2: {
          probabilities: [
            {
              category: PeruseDocumentClassifications.RateConfirmation,
              confidence: 0.612183112360742,
              rawProb: 0.6121831123607419,
            },
            {
              category: PeruseDocumentClassifications.CarrierInvoice,
              confidence: 0.08514005079227246,
              rawProb: 0.08514005079227245,
            },
            {
              category: PeruseDocumentClassifications.NoticeOfAssignment,
              confidence: 0.07929572622538461,
              rawProb: 0.0792957262253846,
            },
            {
              category: PeruseDocumentClassifications.Scales,
              confidence: 0.06635819915518684,
              rawProb: 0.06635819915518683,
            },
            {
              category: PeruseDocumentClassifications.Lumper,
              confidence: 0.06325400767633907,
              rawProb: 0.06325400767633906,
            },
          ],
          status: 'success',
        },
      },
      informationExtractionResult: new InformationExtractionResult({
        rateConfirmation: new RateConfirmationResult({
          carrierContact: ['MANPREET S SAINI'],
          receiverPhone: ['7168944000'],
          deliveryStartTime: ['12:00', '1200'],
          shipperAddress: ['245 Tex Simone Drive', 'SYRACUSE', 'NY 13208'],
          receiverName: ['Allied Frozen Storage - Buffalo, NY'],
          carrierDriverCellphone: ['857-200-7900'],
          brokerContact: ['Allen Nagel'],
          brokerAddress: ['P.O. Box 125', 'Fredonia, NY 14063'],
          deliveryDate: ['2024-05-02'],
          brokerFax: ['7163665352'],
          carrierDriver: ['KK', 'Manni'],
          equipment: ['Reefer (DAT)'],
          carrierCarrierMc: ['958456.'],
          receiverAddress: ['2501 Broadway', 'CHEEKTOWAGA NY 14227'],
          commodity: ['Dairy'],
          carrierName: ['RAYAN INC'],
          pickupDate: ['2024-05-02', '2024-05-02'],
          shipperName: ['Syracuse Cold Storage'],
          brokerPhone: ['7163660817', '7163660817'],
          bolReferenceNumber: ['BC31345'],
          brokerName: [
            'Agricultural Logistics, LLC',
            'Agricultural',
            'Logistics',
          ],
          lineHaulRate: ['650.00'],
          shipperPhone: ['3154752121'],
          pickupReferenceNumber: ['BC31345'],
          weight: ['42560.0'],
          totalRate: ['650.00'],
          carrierTrailer: ['205'],
          shipperContact: ['warehouse'],
          carrierPhone: ['8572007900'],
          carrierAddress: ['FISHERS', 'IN 46040'],
          temperature: ['34.0'],
          brokerEmail: ['test@bobtail.com'],
          receiverContact: ['Main office'],
          carrierTruck: ['25'],
          brokerReferenceNumber: ['5588625', '5588625', '1423110118'],
          shipperAddressState: ['Virginia'],
          receiverAddressState: ['Virginia'],
        }),
      }),
    },
    message: '',
    documentIds: ['fd81358a-fb90-4e01-bb39-00a7d0afeb2b'],
  });
  Object.assign(result, data);
  return result;
};
