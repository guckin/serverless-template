import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Certificate, CertificateValidation, ICertificate} from 'aws-cdk-lib/aws-certificatemanager';
import {HostedZone} from 'aws-cdk-lib/aws-route53';

export type CertificateProps = StackProps & {
  stage: string,
  domainName: string,
  subdomain: string,
};

export class CertificateStack extends Stack {
  private cert: Certificate;

  constructor(scope: Construct, id: string, props: CertificateProps) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName
    });
    this.cert = new Certificate(this, 'Certificate', {
      domainName: `${props.subdomain}.${props.stage}.${props.domainName}`,
      validation: CertificateValidation.fromDns(hostedZone)
    });
  }

  public getCert(scope: Construct, id: string): ICertificate {
    return Certificate.fromCertificateArn(scope, id, this.cert.certificateArn);
  }
}
