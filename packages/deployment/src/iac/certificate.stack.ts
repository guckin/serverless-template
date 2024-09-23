import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Certificate, CertificateValidation, ICertificate} from 'aws-cdk-lib/aws-certificatemanager';
import {HostedZone} from 'aws-cdk-lib/aws-route53';

export type CertificateProps = StackProps & {
  domainName: string,
  subdomain: string,
};

export class CertificateStack extends Stack {
  public cert: ICertificate;

  constructor(scope: Construct, id: string, props: CertificateProps) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromLookup(this, 'hosted-zone', {
      domainName: props.domainName
    });
    this.cert = new Certificate(this, 'certificate', {
      domainName: `${props.subdomain}.${props.domainName}`,
      validation: CertificateValidation.fromDns(hostedZone)
    });
  }
}
