import type { ReactNode } from "react"

const SUPPORT_EMAIL = "pedi2soporte@gmail.com"
const WEBSITE_URL = "https://www.pedi2.com.bo"
const WEBSITE_LABEL = "www.pedi2.com.bo"

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-bold text-ink">{title}</h2>
    <div className="space-y-3 text-[15px] leading-relaxed text-ink-muted">{children}</div>
  </section>
)

export const Policy = () => (
  <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
    <p className="text-sm font-semibold text-brand">Pedí2</p>
    <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Privacy Policy</h1>
    <p className="mt-2 text-sm text-ink-muted">Last updated: September 7, 2026</p>

    <div className="mt-8 space-y-8">
      <p className="text-[15px] leading-relaxed text-ink-muted">
        This Privacy Policy explains how Pedí2 (“Pedí2”, “we”, “us”, or “our”) collects, uses, stores, and
        protects personal information when you use the Pedí2 mobile application and related services.
      </p>
      <p className="text-[15px] leading-relaxed text-ink-muted">
        By using Pedí2, you agree to the practices described in this Privacy Policy.
      </p>

      <Section title="1. Information We Collect">
        <p>Depending on how you use Pedí2, we may collect the following information:</p>

        <h3 className="font-semibold text-ink">Account Information</h3>
        <p>When you create or use an account, we may collect:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Name</li>
          <li>Phone number</li>
          <li>Email address, where provided</li>
          <li>Account credentials and authentication information</li>
          <li>Information associated with your Pedí2 account</li>
        </ul>

        <h3 className="font-semibold text-ink">Order and Delivery Information</h3>
        <p>
          When you place, receive, or fulfill an order, we may collect information necessary to process and
          deliver the order, including:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Order details</li>
          <li>Restaurant information</li>
          <li>Delivery address</li>
          <li>Delivery instructions</li>
          <li>Customer and recipient information</li>
          <li>Order status and delivery information</li>
        </ul>

        <h3 className="font-semibold text-ink">Location Information</h3>
        <p>
          Pedí2 may collect location information when necessary to provide delivery-related services.
        </p>
        <p>
          For example, delivery personnel may share their location while performing a delivery so that Pedí2
          can determine their position and provide delivery tracking functionality.
        </p>
        <p>Location information is used to provide and improve delivery services and is not sold to third parties.</p>

        <h3 className="font-semibold text-ink">Device and Technical Information</h3>
        <p>We may automatically receive certain technical information when you use the application, such as:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Device type and operating system</li>
          <li>Application version</li>
          <li>IP address</li>
          <li>Device identifiers or similar technical identifiers</li>
          <li>Application logs</li>
          <li>Information about errors, crashes, and performance</li>
        </ul>
        <p>This information is used to maintain, secure, troubleshoot, and improve the application.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Create and manage user accounts</li>
          <li>Process and manage orders</li>
          <li>Coordinate deliveries</li>
          <li>Connect customers, restaurants, and delivery personnel when necessary to fulfill an order</li>
          <li>Provide delivery tracking</li>
          <li>Send order and delivery notifications</li>
          <li>Provide customer support</li>
          <li>Authenticate users and protect accounts</li>
          <li>Detect and prevent fraud, abuse, and unauthorized activity</li>
          <li>Maintain and improve the application</li>
          <li>Diagnose technical problems and application crashes</li>
          <li>Comply with applicable legal obligations</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </Section>

      <Section title="3. Information Sharing">
        <p>
          Pedí2 may share information with other users or service providers when necessary to provide the
          services you request.
        </p>
        <p>
          For example, information necessary to complete a delivery may be shared between customers,
          restaurants, and delivery personnel.
        </p>
        <p>
          We may also share information with third-party service providers that help us operate Pedí2, such as
          hosting, infrastructure, communications, analytics, authentication, mapping, or other technical
          service providers.
        </p>
        <p>These providers may only process information as necessary to provide their services to us.</p>
        <p>
          We may also disclose information when required by law, legal process, or a valid governmental
          request, or when reasonably necessary to protect the rights, safety, and security of Pedí2, our
          users, or others.
        </p>
      </Section>

      <Section title="4. Location Information">
        <p>Certain Pedí2 features require access to location information.</p>
        <p>
          Delivery personnel may be asked to provide location information while they are actively performing
          delivery services. This information may be used to display or calculate delivery progress and
          location.
        </p>
        <p>
          You can control location permissions through your device settings. Disabling location permissions
          may prevent certain delivery-related features from functioning correctly.
        </p>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain personal information for as long as reasonably necessary to provide our services, maintain
          business and transaction records, resolve disputes, prevent fraud, enforce our agreements, and
          comply with legal obligations.
        </p>
        <p>
          When personal information is no longer necessary for these purposes, we may delete or anonymize it
          in accordance with our retention practices and applicable law.
        </p>
      </Section>

      <Section title="6. Account and Data Deletion">
        <p>
          You may request deletion of your Pedí2 account and associated personal information by contacting us
          using the contact information provided below.
        </p>
        <p>
          Some information may need to be retained where required by law or where reasonably necessary for
          legitimate purposes such as fraud prevention, security, accounting, dispute resolution, or
          enforcement of legal agreements.
        </p>
        <p>
          To request deletion of your account or personal information, contact:
        </p>
        <p>
          Email:{" "}
          <a className="font-medium text-brand hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
      </Section>

      <Section title="7. Data Security">
        <p>
          We take reasonable technical and organizational measures to protect personal information against
          unauthorized access, loss, misuse, alteration, or disclosure.
        </p>
        <p>
          However, no method of electronic transmission or storage is completely secure, and we cannot
          guarantee absolute security.
        </p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>
          Pedí2 is not intended for children under the age required by applicable law to independently use the
          service.
        </p>
        <p>
          We do not knowingly collect personal information from children in violation of applicable laws. If
          you believe that a child has provided us with personal information improperly, please contact us so
          that we can take appropriate action.
        </p>
      </Section>

      <Section title="9. Third-Party Services">
        <p>
          Pedí2 may use third-party services to provide infrastructure, communications, maps, analytics,
          authentication, notifications, or other functionality.
        </p>
        <p>These services may process information according to their own privacy policies and applicable agreements.</p>
      </Section>

      <Section title="10. Changes to This Privacy Policy">
        <p>We may update this Privacy Policy from time to time.</p>
        <p>
          When we make changes, we will update the “Last updated” date at the top of this policy. Continued
          use of Pedí2 after an update means that the updated Privacy Policy applies to your use of the
          service.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or your personal
          information, contact us at:
        </p>
        <p>
          Pedí2
          <br />
          Email:{" "}
          <a className="font-medium text-brand hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          <br />
          Website:{" "}
          <a className="font-medium text-brand hover:underline" href={WEBSITE_URL} target="_blank" rel="noreferrer">
            {WEBSITE_LABEL}
          </a>
        </p>
      </Section>
    </div>
  </article>
)
