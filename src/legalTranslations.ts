import { APP_NAME, SUPPORT_EMAIL, SUPPORT_WEBSITE } from './constants';

export const legalTranslations = {
  English: {
    privacyPolicy: {
      title: 'Privacy Policy',
      content: `
          <p class="text-sm text-gray-500 mb-8 font-mono">Last Updated: February 2026</p>
          
          <div class="prose-section">
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Welcome to ${APP_NAME} (hereinafter referred to as "this Website"). We respect your privacy and are committed to protecting your personal data and privacy security. This Privacy Policy aims to explain how we collect, use, store, and share your personal information.</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">By accessing, registering, or using this Website and related services, you confirm that you have read, understood, and agreed to this Privacy Policy. If you do not agree to the content of this policy, please stop using this service.</p>
          </div>

          <hr class="my-8 border-gray-200 dark:border-gray-700" />

          <div class="space-y-8">
            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                1. Information We Collect
              </h3>
              <div class="space-y-4">
                <div class="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 class="text-gray-900 dark:text-white mb-2 font-bold text-sm">1.1 Account Information</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">When you register for an account, we collect your <strong>email address</strong>. This is the unique identifier for your account and is used for login, password recovery, and service notifications.</p>
                </div>
                <div class="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 class="text-gray-900 dark:text-white mb-2 font-bold text-sm">1.2 Payment Information</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We offer subscription and top-up services. All payment transactions are processed through the third-party payment platform <strong>Creem</strong>. We do not directly store your complete credit card information or bank account details. Creem may collect necessary payment information to complete the transaction.</p>
                </div>
                <div class="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 class="text-gray-900 dark:text-white mb-2 font-bold text-sm">1.3 User Content</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We collect the images, text descriptions (Prompts), and design specifications you upload to the service in order to provide AI generation functions. <strong>You retain full ownership of this content.</strong></p>
                </div>
                <div class="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 class="text-gray-900 dark:text-white mb-2 font-bold text-sm">1.4 Technical & Usage Data</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We automatically collect information about how you access and use the service, such as IP address, browser type, device information, and access times, to optimize user experience and system performance.</p>
                </div>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                2. How We Use Information
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We use the collected information for the following purposes:</p>
              <ul class="list-disc pl-5 space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li>To provide, maintain, and improve our AI generation services.</li>
                <li>To process your orders and secure payments.</li>
                <li>To send you service notifications, security alerts, and support messages.</li>
                <li>To prevent fraud and abuse, ensuring system security.</li>
                <li>To analyze usage trends to improve our algorithms and user interface.</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                3. Core Privacy Promise
              </h3>
              <div class="backdrop-blur-md bg-gradient-to-r from-indigo-50/80 to-blue-50/80 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-5">
                   <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </div>
                <p class="text-indigo-800 dark:text-indigo-300 font-bold text-sm leading-relaxed mb-3 uppercase tracking-wider">No Training on Your Data</p>
                <p class="text-indigo-900 dark:text-indigo-100 text-sm leading-relaxed font-medium">
                  We solemnly promise that <strong>without your explicit permission, we will never use your User Content (uploaded images) or Generated Content to train, fine-tune, or improve our public foundational AI models.</strong> Your creative assets belong to you, and our role is strictly to provide the tools to enhance them.
                </p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                4. Information Sharing
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We will not sell your personal information to third parties. We only share data in the following circumstances:</p>
              <ul class="list-disc pl-5 space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li><strong>Service Providers:</strong> We share necessary information with trusted third-party service providers (such as Creem for payments, Vercel/Supabase for cloud hosting) strictly for the purpose of service operation.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
                <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or asset sale, your Personal Data may be transferred.</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                5. Data Security
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We implement appropriate technical and organizational measures to protect your personal data, including <strong>industrial-grade encryption</strong> for data at rest and in transit. Access to personal data is strictly limited to employees and contractors who need to know that information in order to process it on our behalf.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                6. Data Retention
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy.</p>
              <div class="backdrop-blur-md bg-gray-50/60 dark:bg-gray-800/60 p-4 rounded-lg mt-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm flex items-start">
                 <div class="mr-3 text-indigo-500 mt-0.5">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"><strong>Regular Cleanup:</strong> To minimize privacy risks, our system automatically cleans historical upload records periodically. Your generation records will be retained.</p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                7. Your Rights
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Depending on your location, you may have the following rights regarding your personal data:</p>
              <ul class="list-disc pl-5 space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li><strong>Access:</strong> The right to access, update, or delete the information we have on you.</li>
                <li><strong>Rectification:</strong> The right to have your information rectified if that information is inaccurate or incomplete.</li>
                <li><strong>Object:</strong> The right to object to our processing of your Personal Data.</li>
                <li><strong>Restriction:</strong> The right to request that we restrict the processing of your personal information.</li>
                <li><strong>Data Portability:</strong> The right to be provided with a copy of the information we have on you in a structured, machine-readable, and commonly used format.</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                8. Cookies and Tracking Technologies
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We use Cookies and similar tracking technologies to track the activity on our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service. You can instruct your browser to refuse all Cookies or to indicate when a Cookie is being sent.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                9. Children's Privacy
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                10. Changes to Privacy Policy
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We may update this Privacy Policy from time to time. The updated version will be posted on this page with an effective date. Your continued use of the service constitutes acceptance of the updated policy.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                11. Contact Us
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">If you have any questions about this Privacy Policy, please contact us:</p>
              <div class="mt-4 space-y-2">
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Email: {SUPPORT_EMAIL}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Official Website: <a href={SUPPORT_WEBSITE} class="text-indigo-600 underline">{SUPPORT_WEBSITE}</a></p>
              </div>
            </section>
          </div>
        `
    },
    termsOfService: {
      title: 'Terms of Service',
      content: `
          <p class="text-sm text-gray-500 mb-8 font-mono">Last Updated: February 2026</p>

          <div class="prose-section">
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Welcome to ${APP_NAME} (hereinafter referred to as "this Website" or "the Service"). These Terms of Service (hereinafter referred to as "these Terms") constitute a legally binding agreement between you and ${APP_NAME} (hereinafter referred to as "we", "us", or "our") regarding your access to and use of our website and services.</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">By accessing, registering for, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Service.</p>
          </div>

          <hr class="my-8 border-gray-200 dark:border-gray-700" />

          <div class="space-y-8">
            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                1. Eligibility and Account Registration
              </h3>
              <ul class="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li><strong>Age Requirement:</strong> You must be at least 18 years old, or the age of legal majority in your jurisdiction, to use this Service. By using the Service, you represent and warrant that you meet this requirement.</li>
                <li><strong>Account Security:</strong> To access certain features, you must register an account using a valid email address. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
                <li><strong>Truthful Information:</strong> You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                2. Service Description
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">${APP_NAME} provides an AI-powered e-commerce visual generation platform. The Service aims to provide the ultimate visual productivity tool for cross-border e-commerce and digital marketers by integrating the world's top artificial intelligence models.</p>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Our Service allows users to upload product images and generate marketing visuals using artificial intelligence.</p>
              <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <p class="mb-2 font-semibold text-gray-900 dark:text-white text-sm">Key features include:</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <li>AI-driven product photography generation</li>
                  <li>Image enhancement and upscaling</li>
                  <li>Visual style transfer and background replacement</li>
                  <li>Digital asset management</li>
                </ul>
              </div>
              <p class="mt-4 text-sm text-gray-500">We continuously improve our Service and reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                3. Subscription, Credits, and Payments
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">${APP_NAME} offers tiered subscription plans to suit different needs. Current pricing tiers are as follows:</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-6">
                <div class="p-5 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition hover:shadow-md">
                  <span class="block font-bold text-lg text-gray-900 dark:text-white mb-2">Starter</span>
                  <span class="block text-indigo-600 font-black text-2xl">$5 <span class="text-sm font-normal text-gray-500">/ month</span></span>
                </div>
                <div class="p-5 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50 shadow-sm relative transition hover:shadow-md">
                  <div class="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">POPULAR</div>
                  <span class="block font-bold text-lg text-gray-900 dark:text-white mb-2">Professional</span>
                  <span class="block text-indigo-600 font-black text-2xl">$20 <span class="text-sm font-normal text-gray-500">/ month</span></span>
                </div>
                <div class="p-5 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition hover:shadow-md">
                  <span class="block font-bold text-lg text-gray-900 dark:text-white mb-2">Enterprise</span>
                  <span class="block text-indigo-600 font-black text-2xl">$100 <span class="text-sm font-normal text-gray-500">/ month</span></span>
                </div>
              </div>
              <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p><strong>Payment Processing:</strong> All financial transactions are securely processed by our third-party payment provider, <strong>Creem</strong>. By subscribing, you authorize us to charge your payment method for the applicable fees.</p>
                <p><strong>Billing Cycle:</strong> Subscription fees are billed in advance on a monthly basis. Credits included in the plan are reset or accumulated according to the specific plan rules.</p>
                <p><strong>Taxes:</strong> You are responsible for any applicable taxes, duties, or other governmental levies associated with your purchase.</p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                4. Cancellation and Refund Policy
              </h3>
              <ul class="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li><strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. The cancellation will take effect at the end of the current billing period.</li>
                <li><strong>No Refunds:</strong> Except where required by applicable law, all fees paid are non-refundable. We do not provide refunds or credits for partially used subscription periods or unused service credits.</li>
                <li><strong>Service Access:</strong> Upon cancellation, you will retain access to your subscription benefits until the end of the current billing cycle.</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                5. Intellectual Property Rights
              </h3>
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">5.1 Your Content & Ownership</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">You retain ownership of all original images, assets, and text prompts (collectively "User Content") uploaded to the Service. We understand the importance of your data assets; <strong>${APP_NAME} does not claim any ownership over your original User Content.</strong></p>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">5.2 Generated Assets</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Subject to your compliance with these Terms, ${APP_NAME} assigns to you all right, title, and interest in and to the images generated by the Service based on your User Content ("Generated Content"). You are free to use these assets for commercial purposes (such as e-commerce listings, advertising campaigns, etc.).</p>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">5.3 License & Scope</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">To enable AI image processing functions, you grant ${APP_NAME} a non-exclusive, worldwide, royalty-free license to use, host, and process your User Content. This license is <strong>limited strictly</strong> to providing the following services:</p>
                  <ul class="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <li>AI image generation and enhancement (e.g., upscaling, restoration);</li>
                    <li>Style transfer and background replacement;</li>
                    <li>Other technical processing related to e-commerce visuals.</li>
                  </ul>
                </div>
                <div class="backdrop-blur-md bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <h4 class="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">5.4 Model Training & Tech Source (Core Commitment)</h4>
                  <ul class="list-disc pl-5 mt-2 space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <li><strong>Non-Training Use:</strong> We solemnly promise that <strong>without your explicit permission, we will never use your User Content or Generated Content to train, fine-tune, or improve our public foundational AI models.</strong></li>
                    <li><strong>Top-Tier Model Driven:</strong> ${APP_NAME} utilizes world-leading third-party commercial AI models (such as Nano Banana 2, Gemini 3 Pro, or other industry leaders) to provide underlying technical support. ${APP_NAME} is an independent platform and is not affiliated with, endorsed by, or sponsored by the creators of these models. We focus on the integration and optimization of visual algorithms, rather than building private foundational models using user privacy data.</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                6. Platform Ownership
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">The Service, including but not limited to its software, code, proprietary algorithms, design, text, graphics, and logos (excluding User Content), is the exclusive property of ${APP_NAME} and its licensors. These are protected by copyright, trademark, and other intellectual property laws of Singapore and foreign countries.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                7. Acceptable Use Policy
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">You agree not to misuse the Service. Prohibited actions include:</p>
              <ul class="list-disc pl-5 space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li>Generating content that is illegal, hateful, sexually explicit, or promotes violence.</li>
                <li>Infringing upon the intellectual property or privacy rights of others.</li>
                <li>Reverse engineering, decompiling, or attempting to extract the source code of the Service.</li>
                <li>Using automated scripts, scrapers, or bots to access the Service.</li>
                <li>Interfering with the operation or security of the Service.</li>
                <li>Reselling access to the Service without our express written permission.</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                8. AI Disclaimer and Limitations
              </h3>
              <div class="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"><strong>Nature of AI:</strong> The Service utilizes probabilistic AI models. Generated outputs may vary and may not always accurately reflect reality. Artifacts, distortions, or unexpected results may occur.</p>
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"><strong>No Professional Advice:</strong> The Service is a creative tool and does not constitute professional advice. You are solely responsible for reviewing and verifying all generated content before using it for commercial purposes.</p>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"><strong>Non-Exclusivity of Generations:</strong> Due to the nature of AI generation, it is possible that similar prompts may produce similar results for different users.</p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                9. Termination
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account through the settings portal. Provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                10. Third-Party Links and Services
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">The Service may contain links to third-party websites or services that are not owned or controlled by ${APP_NAME} (e.g., payment processors like Creem). We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.</p>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">You acknowledge and agree that ${APP_NAME} shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                11. DISCLAIMER OF WARRANTIES
              </h3>
              <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p class="uppercase text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. ${APP_NAME.toUpperCase()} MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, REGARDING THE OPERATION OF THE SERVICE OR THE INFORMATION, CONTENT, MATERIALS, OR PRODUCTS INCLUDED ON THE SERVICE. TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, ${APP_NAME.toUpperCase()} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ${APP_NAME.toUpperCase()} DOES NOT WARRANT THAT THE SERVICE, ITS SERVERS, OR EMAIL SENT FROM ${APP_NAME.toUpperCase()} ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                </p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                12. LIMITATION OF LIABILITY
              </h3>
              <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p class="uppercase text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">
                  IN NO EVENT SHALL ${APP_NAME.toUpperCase()}, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (III) ANY CONTENT OBTAINED FROM THE SERVICE; AND (IV) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                13. Indemnification
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">You agree to defend, indemnify, and hold harmless ${APP_NAME} and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, by you or any person using your account and password, or b) a breach of these Terms.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                14. Privacy, Security & Data Management
              </h3>
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">14.1 Data Security & Encryption</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Your privacy and trade secrets are protected at the highest level. All User Content you upload is processed with <strong>industrial-grade encryption technology</strong> during storage and transmission to prevent unauthorized access or leakage.</p>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">14.2 Storage & Regular Cleanup Mechanism</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">To ensure efficient system operation and minimize privacy risks, ${APP_NAME} implements the following data processing strategies:</p>
                  <ul class="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <li><strong>Temporary Storage:</strong> We retain your data only for the period necessary to provide the service.</li>
                    <li><strong>Regular Cleanup:</strong> Our system regularly cleans (deletes) historical upload records according to service settings. Your generation records will be retained.</li>
                  </ul>
                </div>
                <div>
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Your privacy is important to us. Our use of your personal information is further governed by our <a href="#" class="text-indigo-600 underline">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>
                </div>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                15. Force Majeure
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">${APP_NAME} shall not be liable for any failure to perform its obligations hereunder where such failure results from any cause beyond ${APP_NAME}'s reasonable control, including, without limitation, mechanical, electronic or communications failure or degradation, acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation facilities, fuel, energy, labor or materials.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                16. Governing Law
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">These Terms shall be governed and construed in accordance with the laws of <strong>Singapore</strong>, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                17. Changes to Terms
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                18. Severability and Waiver
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect. No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term.</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                19. Contact Us
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">If you have any questions about these Terms, please contact us at:</p>
              <div class="mt-4 space-y-2">
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Email: {SUPPORT_EMAIL}</p>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Official Website: <a href={SUPPORT_WEBSITE} class="text-indigo-600 underline">{SUPPORT_WEBSITE}</a></p>
              </div>
            </section>
          </div>
        `
    },
    aboutUs: {
        title: 'About Us',
        content: `
          <!-- Hero -->
          <div class="relative overflow-hidden mb-12 rounded-2xl bg-gray-900 text-white p-8 md:p-12">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
            <!-- Decorative Tech Grid -->
            <div class="absolute inset-0" style="background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.3;"></div>
            
            <div class="relative z-10">
               <div class="font-mono text-xs text-indigo-400 mb-4 tracking-widest uppercase flex items-center">
                  <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  System Status: Operational
               </div>
               <h2 class="text-4xl md:text-5xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                 The Neural Engine <br/> for Commerce.
               </h2>
               <p class="text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
                 ${APP_NAME} is not just a tool; it's a high-performance generative infrastructure designed to democratize professional visual production.
               </p>
            </div>
          </div>

          <!-- Key Metrics (Dashboard style) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div class="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
               <div class="absolute top-0 right-0 p-4 opacity-10">
                  <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
               </div>
               <div class="text-3xl font-black text-indigo-600 mb-1 font-mono">10x</div>
               <div class="font-mono text-xs text-gray-500 uppercase tracking-wider">Production Velocity</div>
            </div>
             <div class="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
               <div class="absolute top-0 right-0 p-4 opacity-10">
                  <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
               </div>
               <div class="text-3xl font-black text-indigo-600 mb-1 font-mono">1/10</div>
               <div class="font-mono text-xs text-gray-500 uppercase tracking-wider">Cost Efficiency</div>
            </div>
             <div class="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
               <div class="absolute top-0 right-0 p-4 opacity-10">
                  <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
               </div>
               <div class="text-3xl font-black text-indigo-600 mb-1 font-mono">4K</div>
               <div class="font-mono text-xs text-gray-500 uppercase tracking-wider">Ultra-HD Output</div>
            </div>
          </div>

          <br />
          <br />
          <hr class="my-20 border-gray-200 dark:border-gray-700" />
          <br />
          <br />


          <!-- Tech Stack -->
          <div class="mb-16">
             <h3 class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-8 flex items-center">
               <span class="w-1.5 h-8 bg-primary-600 mr-4 rounded-full"></span>
               Core Architecture
             </h3>
             <br />
             <div class="grid grid-cols-1 gap-4">
                <div class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                   <div class="font-mono text-indigo-600 mr-6 font-bold text-lg">L1</div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">Subject Lock Engine</div>
                      <div class="text-xs text-gray-500 font-mono mt-1">PROPRIETARY FEATURE PRESERVATION PROTOCOL</div>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Ensures 100% geometric and textural fidelity of the input product while reconstructing the environment.</p>
                   </div>
                </div>
                <div class="mt-4 flex items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border-l-4 border-purple-500 shadow-sm">
                   <div class="font-mono text-purple-600 mr-6 font-bold text-lg">L2</div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">Nano Banana 2</div>
                      <div class="text-xs text-gray-500 font-mono mt-1">SOTA VISUAL & MULTIMODAL MODEL</div>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Powered by Nano Banana 2, the world's leading visual and multimodal model for precise lighting, depth, and material understanding.</p>
                   </div>
                </div>
                 <div class="mt-4 flex items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border-l-4 border-blue-500 shadow-sm">
                   <div class="font-mono text-blue-600 mr-6 font-bold text-lg">L3</div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">Semantic Bridge</div>
                      <div class="text-xs text-gray-500 font-mono mt-1">NLP TO VISUAL TRANSLATION</div>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Advanced language understanding to precisely interpret marketing intent into visual composition.</p>
                   </div>
                </div>
             </div>
          </div>
          <br />
          <br />
          <hr class="my-20 border-gray-200 dark:border-gray-700" />
          <br />
          <br />

          <!-- Mission/Directives -->
          <div class="mb-16 mt-24">
            <h3 class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center">
               <span class="w-1.5 h-8 bg-primary-600 mr-4 rounded-full"></span>
               Our Mission
             </h3>
             <br />
             <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl">
               Empowering growth by removing visual barriers. Bringing every creative idea to life.
             </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div class="backdrop-blur-md bg-gray-50/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                 <div class="font-mono text-xs text-gray-400 mb-2">MISSION_01</div>
                 <div class="font-bold text-lg text-gray-900 dark:text-white mb-2">Empower Growth</div>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Eliminate visual production costs as a bottleneck for business growth.</p>
               </div>
               <div class="backdrop-blur-md bg-gray-50/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                 <div class="font-mono text-xs text-gray-400 mb-2">MISSION_02</div>
                 <div class="font-bold text-lg text-gray-900 dark:text-white mb-2">Unleash Creativity</div>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Enable every creative idea to be realized with minimal barriers.</p>
               </div>
               <div class="backdrop-blur-md bg-gray-50/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                 <div class="font-mono text-xs text-gray-400 mb-2">MISSION_03</div>
                 <div class="font-bold text-lg text-gray-900 dark:text-white mb-2">Drive Results</div>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Focus on generating high-converting commercial visuals that deliver real results.</p>
               </div>
            </div>
          </div>


        `
      }
  },
  Chinese: {
    privacyPolicy: {
        title: '隐私政策',
        content: `
          <p class="text-sm text-gray-500 mb-8 font-mono">最后更新日期：2026年2月</p>
          
          <div class="prose-section">
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">欢迎访问和使用 ${APP_NAME}（以下简称“本网站”）。我们尊重您的隐私，并致力于保护您的个人数据和隐私安全。本隐私政策旨在向您说明我们如何收集、使用、存储和分享您的个人信息。</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">一旦您访问、注册或使用本网站及相关服务，即表示您已阅读、理解并同意本隐私政策。如您不同意本政策内容，请停止使用本服务。</p>
          </div>

          <hr class="my-8 border-gray-200 dark:border-gray-700" />

          <div class="space-y-8">
            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                1. 我们收集的信息
              </h3>
              <div class="space-y-4">
                <div class="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 class="text-gray-900 dark:text-white mb-2 font-bold text-sm">1.1 账户信息</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">当您注册账户时，我们会收集您的<strong>电子邮箱地址</strong>。这是您账户的唯一标识，用于登录、找回密码及接收服务通知。</p>
                </div>
                <div class="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 class="text-gray-900 dark:text-white mb-2 font-bold text-sm">1.2 支付信息</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们提供订阅及充值服务。所有支付交易均通过第三方支付平台 <strong>Creem</strong> 完成。我们不会直接存储您的完整信用卡信息或银行账户详情。Creem 可能会收集必要的支付信息以完成交易。</p>
                </div>
                <div class="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 class="text-gray-900 dark:text-white mb-2 font-bold text-sm">1.3 用户内容</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">为了提供 AI 生成功能，我们会收集您上传至服务的图片、文本描述（Prompt）及设计规范。<strong>您保留对这些内容的完整所有权。</strong></p>
                </div>
                <div class="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 class="text-gray-900 dark:text-white mb-2 font-bold text-sm">1.4 技术与使用数据</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们可能会自动收集有关您如何访问和使用服务的信息，例如 IP 地址、浏览器类型、设备信息及访问时间，以优化用户体验和系统性能。</p>
                </div>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                2. 我们如何使用信息
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们将收集的信息用于以下目的：</p>
              <ul class="list-disc pl-5 space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li>提供、维护和改进我们的 AI 生成服务。</li>
                <li>处理您的订单和确保支付安全。</li>
                <li>向您发送服务通知、安全警报和支持消息。</li>
                <li>防止欺诈和滥用行为，保障系统安全。</li>
                <li>分析使用趋势以改进我们的算法和用户界面。</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                3. 核心隐私承诺
              </h3>
              <div class="backdrop-blur-md bg-gradient-to-r from-indigo-50/80 to-blue-50/80 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-5">
                   <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </div>
                <p class="text-indigo-800 dark:text-indigo-300 font-bold text-sm leading-relaxed mb-3 uppercase tracking-wider">不使用您的数据进行训练</p>
                <p class="text-indigo-900 dark:text-indigo-100 text-sm leading-relaxed font-medium">
                  我们郑重承诺：<strong>未经您的明确同意，我们绝不会使用您的用户内容（上传的图片）或生成内容来训练、微调或改进我们的公共基础 AI 模型。</strong> 您的创意资产归您所有，我们的角色仅限于提供增强这些资产的工具。
                </p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                4. 信息共享
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们不会将您的个人信息出售给第三方。我们仅在以下情况分享数据：</p>
              <ul class="list-disc pl-5 space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li><strong>服务提供商：</strong> 我们与受信任的第三方服务提供商（如 Creem 支付、Vercel/Supabase 云托管）共享必要信息，严格仅用于支持服务运行。</li>
                <li><strong>法律要求：</strong> 如法律法规要求或响应公共机构的有效请求（如法院或政府机构），我们可能会披露信息。</li>
                <li><strong>业务转让：</strong> 如果我们涉及合并、收购或资产出售，您的个人数据可能会被转移。</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                5. 数据安全
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们采取适当的技术和组织措施来保护您的个人数据，包括对静态和传输中的数据进行<strong>工业级加密</strong>。对个人数据的访问严格限制在需要知道该信息以便代表我们处理该信息的员工和承包商范围内。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                6. 数据保留
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们仅在本隐私政策所述目的所需的期限内保留您的个人数据。</p>
              <div class="backdrop-blur-md bg-gray-50/60 dark:bg-gray-800/60 p-4 rounded-lg mt-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm flex items-start">
                 <div class="mr-3 text-indigo-500 mt-0.5">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"><strong>定期清理：</strong> 为了最大限度降低隐私风险，我们的系统会定期自动清理<strong>历史上传记录</strong>。请务必及时备份您的重要资产。</p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                7. 您的权利
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">根据您所在的地区，您可能拥有以下关于您个人数据的权利：</p>
              <ul class="list-disc pl-5 space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li><strong>访问权：</strong> 访问、更新或删除我们拥有的关于您的信息的权利。</li>
                <li><strong>更正权：</strong> 如果信息不准确或不完整，有权要求更正您的信息。</li>
                <li><strong>反对权：</strong> 反对我们处理您的个人数据的权利。</li>
                <li><strong>限制权：</strong> 请求我们限制处理您的个人信息的权利。</li>
                <li><strong>数据可携带权：</strong> 有权获取我们拥有的关于您的信息的副本，格式应为结构化、机器可读和常用的格式。</li>
              </ul>
              <p class="mt-4 text-sm text-gray-500 italic">如需行使上述任何权利，请直接通过 <a href={"mailto:" + SUPPORT_EMAIL} class="text-indigo-600 underline">{SUPPORT_EMAIL}</a> 联系我们的合规团队，我们将为您提供人工协助。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                8. Cookies 和追踪技术
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们使用 Cookie 和类似的追踪技术来追踪我们服务上的活动并存储某些信息。使用的追踪技术包括信标、标签和脚本，用于收集和追踪信息以及改进和分析我们的服务。您可以指示您的浏览器拒绝所有 Cookie 或在发送 Cookie 时进行提示。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                9. 儿童隐私
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们的服务不面向 18 岁以下的任何人（“儿童”）。我们不会有意收集 18 岁以下任何人的个人身份信息。如果您是父母或监护人，并且您知道您的孩子向我们提供了个人数据，请联系我们。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                10. 隐私政策的变更
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们可能会不定期更新本隐私政策。更新后的版本将在本页面公布并注明生效日期。您继续使用服务即视为接受更新后的政策。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                11. 联系我们
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">如您对本隐私政策或您的个人信息有任何疑问或请求，请联系我们：</p>
              <div class="mt-4 space-y-2">
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">联系邮箱：{SUPPORT_EMAIL}</p>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">官方网站：<a href={SUPPORT_WEBSITE} class="text-indigo-600 underline">{SUPPORT_WEBSITE}</a></p>
              </div>
            </section>
          </div>
        `
      },
    termsOfService: {
        title: '服务条款',
        content: `
          <p class="text-sm text-gray-500 mb-8 font-mono">最后更新日期：2026年2月</p>
          
          <div class="prose-section">
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">欢迎访问和使用 ${APP_NAME}（以下简称“本网站”或“本服务”）。本服务条款（以下简称“本条款”）构成您与 ${APP_NAME}（以下简称“我们”）之间关于您访问和使用我们网站及服务的具有法律约束力的协议。</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">一旦您访问、注册或使用本服务，即表示您确认已阅读、理解并同意受本条款的约束。如果您不同意本条款的任何内容，请务必立即停止使用本服务。</p>
          </div>

          <hr class="my-8 border-gray-200 dark:border-gray-700" />

          <div class="space-y-8">
            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                1. 使用资格与账户注册
              </h3>
              <ul class="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li><strong>年龄要求：</strong> 您必须年满 <strong>18 周岁</strong>，或达到您所在司法辖区规定的法定成年年龄，方可使用本服务。使用本服务即代表您声明并保证您符合此要求。</li>
                <li><strong>账户安全：</strong> 为了使用特定功能，您需要使用有效的电子邮箱地址注册账户。您有责任妥善保管您的账户凭证，并对您账户下发生的所有活动承担法律责任。</li>
                <li><strong>信息真实性：</strong> 您同意在注册过程中提供准确、最新和完整的信息，并及时更新以保持其准确性。</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                2. 服务内容描述
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">${APP_NAME} 提供基于人工智能的电商视觉生成平台。本服务旨在通过集成全球顶尖的人工智能模型，为跨境电商及数字营销人员提供极致的视觉生产力工具。</p>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们的服务允许用户上传产品图片并利用人工智能技术生成营销视觉素材。</p>
              <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <p class="mb-2 font-semibold text-gray-900 dark:text-white text-sm">核心功能包括：</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <li>AI 驱动的产品摄影生成</li>
                  <li>图像智能优化与高清放大</li>
                  <li>视觉风格迁移与背景替换</li>
                  <li>数字资产管理</li>
                </ul>
              </div>
              <p class="mt-4 text-sm text-gray-500">我们致力于持续改进服务，并保留在不事先通知的情况下随时修改、暂停或终止服务任何部分的权利。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                3. 订阅、积分与支付
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">${APP_NAME} 提供多种层级的订阅计划以满足不同需求。当前的定价层级如下：</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-6">
                <div class="p-5 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition hover:shadow-md">
                  <span class="block font-bold text-lg text-gray-900 dark:text-white mb-2">入门版</span>
                  <span class="block text-indigo-600 font-black text-2xl">$5 <span class="text-sm font-normal text-gray-500">/ 月</span></span>
                </div>
                <div class="p-5 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50 shadow-sm relative transition hover:shadow-md">
                  <div class="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">POPULAR</div>
                  <span class="block font-bold text-lg text-gray-900 dark:text-white mb-2">专业版</span>
                  <span class="block text-indigo-600 font-black text-2xl">$20 <span class="text-sm font-normal text-gray-500">/ 月</span></span>
                </div>
                <div class="p-5 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition hover:shadow-md">
                  <span class="block font-bold text-lg text-gray-900 dark:text-white mb-2">企业版</span>
                  <span class="block text-indigo-600 font-black text-2xl">$100 <span class="text-sm font-normal text-gray-500">/ 月</span></span>
                </div>
              </div>
              <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p><strong>支付处理：</strong> 所有金融交易均由我们的第三方支付提供商 <strong>Creem</strong> 安全处理。订阅即表示您授权我们通过您的支付方式收取相应费用。</p>
                <p><strong>计费周期：</strong> 订阅费用按月度周期预付。计划内包含的积分将根据具体计划规则进行重置或累积。</p>
                <p><strong>税费：</strong> 您需自行承担与购买相关的任何适用税费、关税或其他政府征费。</p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                4. 取消与退款政策
              </h3>
              <ul class="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li><strong>取消订阅：</strong> 您可随时通过账户设置取消订阅。取消将在当前计费周期结束后生效。</li>
                <li><strong>无退款：</strong> 除适用法律强制规定外，所有已支付费用均不予退款。我们不针对部分使用的订阅周期或未使用的服务积分提供退款或抵扣。</li>
                <li><strong>服务访问：</strong> 取消订阅后，您仍可在当前计费周期结束前继续享受订阅权益。</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                5. 知识产权与内容所有权
              </h3>
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">5.1 您的内容与所有权</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">您保留上传至本服务的所有原始图片、素材及文本提示词（统称为“用户内容”）的所有权。我们深知数据资产对您的重要性，<strong>${APP_NAME} 不会对您的原始用户内容拥有任何所有权。</strong></p>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">5.2 生成的资产</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">在您遵守本条款的前提下，${APP_NAME} 将基于您的用户内容通过本服务生成的图片（“生成内容”）的所有权利、所有权和利益转让给您。您可以自由将这些资产用于商业目的（如电商列表、广告投放等）。</p>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">5.3 授权许可与使用范围</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">为了实现 AI 图像处理功能，您授予 ${APP_NAME} 一项非独占、全球性、免版税的许可，允许我们使用、托管及处理您的用户内容。此许可<strong>仅限于</strong>为您提供以下服务：</p>
                  <ul class="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <li>AI 图像生成与增强（如高清化、修复）；</li>
                    <li>风格转化与背景替换；</li>
                    <li>其他与电商视觉相关的技术处理。</li>
                  </ul>
                </div>
                <div class="backdrop-blur-md bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <h4 class="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">5.4 模型训练与技术来源（核心承诺）</h4>
                  <ul class="list-disc pl-5 mt-2 space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <li><strong>非模型训练用途：</strong> 我们郑重承诺，<strong>未经您的明确许可，我们绝不会将您的用户内容或生成内容用于训练、微调或改进我们的公共基础 AI 模型。</strong></li>
                    <li><strong>顶尖模型驱动：</strong> ${APP_NAME} 采用世界顶尖的第三方商业 AI 模型（如 Nano Banana2, Gemini 3.1 或其他行业领先模型）为您提供底层技术支持。${APP_NAME} 是一个独立平台，与这些模型的创建者没有任何关联、认可或赞助关系。我们专注于视觉算法的集成优化，而非利用用户隐私数据构建私有基础模型。</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                6. 平台所有权声明
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">本服务，包括但不限于其软件、代码、专有算法、设计、文本、图形和徽标（不包括用户内容），均为 ${APP_NAME} 及其许可方的专有财产。这些内容受新加坡及外国的版权法、商标法和其他知识产权法律保护。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                7. 合理使用规范 (Acceptable Use)
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">您同意不滥用本服务。禁止的行为包括：</p>
              <ul class="list-disc pl-5 space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li>生成非法、仇恨、色情或宣扬暴力的内容。</li>
                <li>侵犯他人的知识产权或隐私权。</li>
                <li>反向工程、反编译或试图提取本服务的源代码。</li>
                <li>使用自动化脚本、爬虫或机器人访问本服务。</li>
                <li>干扰本服务的运行或安全性。</li>
                <li>未经我们明确书面许可，转售本服务的访问权限。</li>
              </ul>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                8. AI 免责声明与局限性</h3>
              <div class="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"><strong>AI 的本质：</strong> 本服务利用概率性人工智能模型。生成的输出可能会有所不同，且不一定总是准确反映现实。可能会出现伪影、扭曲或意外结果。</p>
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"><strong>非专业建议：</strong> 本服务仅作为创意工具，不构成专业建议。您有责任在将所有生成内容用于商业目的之前对其进行审查和核实。</p>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"><strong>生成内容的非独占性：</strong> 由于 AI 生成的特性，不同的用户使用相似的提示词可能会得到相似的结果。</p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                9. 账户终止
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们保留在不事先通知或承担责任的情况下，出于任何原因（包括但不限于违反本条款）自行决定立即暂停或终止您的账户及服务访问权限的权利。</p>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">终止后，您使用本服务的权利将立即终止。如果您希望终止账户，只需停止使用服务或通过设置门户删除账户即可。本条款中按其性质应在终止后继续有效的条款将继续有效，包括所有权规定、保证免责声明、赔偿和责任限制。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                10. 第三方链接与服务
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">本服务可能包含指向非 ${APP_NAME} 所有或控制的第三方网站或服务的链接（例如 Creem 等支付处理商）。我们对任何第三方网站或服务的内容、隐私政策或做法无法控制，也不承担任何责任。</p>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">您承认并同意，对于因使用或依赖任何此类网站或服务上的任何内容、商品或服务而造成或据称造成的任何损害或损失，${APP_NAME} 不承担任何直接或间接责任。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                11. 保证免责声明 (DISCLAIMER)
              </h3>
              <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p class="uppercase text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">
                  本服务按“原样”和“可用”基础提供。${APP_NAME.toUpperCase()} 不对服务的运行或服务中包含的信息、内容、材料或产品作任何形式的明示或暗示的陈述或保证。在适用法律允许的最大范围内，${APP_NAME.toUpperCase()} 免除所有明示或暗示的保证，包括但不限于对适销性、特定用途适用性和非侵权的暗示保证。${APP_NAME.toUpperCase()} 不保证服务、其服务器或从 ${APP_NAME.toUpperCase()} 发送的电子邮件没有病毒或其他有害成分。
                </p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                12. 责任限制 (LIMITATION OF LIABILITY)
              </h3>
              <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p class="uppercase text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-300">
                  在任何情况下，${APP_NAME.toUpperCase()} 及其董事、员工、合作伙伴、代理商、供应商或附属公司均不对任何间接、附带、特殊、后果性或惩罚性损害承担责任，包括但不限于利润、数据、使用、商誉或其他无形损失，这些损失源于 (I) 您访问或使用或无法访问或使用本服务；(II) 本服务上任何第三方的任何行为或内容；(III) 从本服务获得的任何内容；以及 (IV) 未经授权访问、使用或更改您的传输或内容，无论是否基于保证、合同、侵权（包括疏忽）或任何其他法律理论，无论我们是否已被告知此类损害的可能性。
                </p>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                13. 赔偿责任
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">您同意保护、赔偿并使 ${APP_NAME} 及其被许可人和许可人，及其员工、承包商、代理商、管理人员和董事免受因以下原因引起或导致的任何及所有索赔、损害、义务、损失、责任、成本或债务以及费用（包括但不限于律师费）：a) 您或任何使用您的账户和密码的人使用和访问服务，或 b) 违反本条款。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                14. 隐私、安全与数据管理
              </h3>
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">14.1 数据安全与加密</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">您的隐私和商业秘密受最高级别的保护。您上传的所有用户内容在存储和传输过程中均经过<strong>工业级加密技术处理</strong>，以防止未经授权的访问或泄露。</p>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">14.2 存储与定期清理机制</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">为了保障系统的高效运行并最大限度降低您的隐私风险，${APP_NAME} 实行以下数据处理策略：</p>
                  <ul class="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <li><strong>临时存储：</strong> 我们仅在为您提供服务所必需的期限内保留您的数据。</li>
                    <li><strong>定期清理：</strong> 我们的系统会根据服务设置定期清理（删除）<strong>历史上传记录</strong>。您的生成记录将会被保留。</li>
                  </ul>
                </div>
                <div>
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">您的隐私对我们至关重要。我们对您个人信息的使用受我们的<a href="#" class="text-indigo-600 underline">隐私政策</a>管辖，该政策通过引用纳入本条款。</p>
                </div>
              </div>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                15. 不可抗力
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">对于因超出 ${APP_NAME} 合理控制范围的任何原因（包括但不限于机械、电子或通信故障、自然灾害、战争、恐怖主义、骚乱、禁运、民事或军事当局行为、火灾、洪水、事故、罢工或运输设施、燃料、能源、劳动力或材料短缺）而导致未能履行义务的情况，${APP_NAME} 概不负责。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                16. 适用法律
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">本条款应受<strong>新加坡</strong>法律管辖并按其解释，不考虑其法律冲突规定。我们要执行本条款的任何权利或规定的失败不应被视为放弃这些权利。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                17. 条款变更
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">我们保留自行决定随时修改或替换本条款的权利。如果修改是重大的，我们将尽力在任何新条款生效前至少提供 30 天的通知。何种变更构成重大变更将由我们自行决定。在这些修订生效后继续访问或使用我们的服务，即表示您同意受修订后条款的约束。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                18. 可分割性与弃权
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">如果本条款的任何规定被判定为不可执行或无效，该规定将被修改和解释，以便在适用法律允许的最大范围内实现该规定的目标，其余规定将继续完全有效。对本条款任何条款的弃权不应被视为对该条款或任何其他条款的进一步或持续弃权。</p>
            </section>

            <hr class="my-8 border-gray-200 dark:border-gray-700" />

            <section>
              <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-indigo-600 mr-3 rounded-full"></span>
                19. 联系我们
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">如您对本条款有任何疑问，请通过以下方式联系我们：</p>
              <div class="mt-4 space-y-2">
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">联系邮箱：{SUPPORT_EMAIL}</p>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">官方网站：<a href={SUPPORT_WEBSITE} class="text-indigo-600 underline">{SUPPORT_WEBSITE}</a></p>
              </div>
            </section>
          </div>
        `
      },
    aboutUs: {
        title: '关于我们',
        content: `
          <!-- Hero -->
          <div class="relative overflow-hidden mb-12 rounded-2xl bg-gray-900 text-white p-8 md:p-12">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
            <!-- Decorative Tech Grid -->
            <div class="absolute inset-0" style="background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.3;"></div>
            
            <div class="relative z-10">
               <div class="font-mono text-xs text-indigo-400 mb-4 tracking-widest uppercase flex items-center">
                  <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  系统状态：运行中
               </div>
               <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-normal bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                 商业影像的 <br/> 神经渲染引擎。
               </h2>
               <p class="text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
                 ${APP_NAME} 不仅仅是一个工具；它是专为民主化专业视觉生产而设计的下一代生成式基础设施。
               </p>
            </div>
          </div>

          <!-- Key Metrics (Dashboard style) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div class="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
               <div class="absolute top-0 right-0 p-4 opacity-10">
                  <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
               </div>
               <div class="text-3xl font-black text-indigo-600 mb-1 font-mono">10x</div>
               <div class="text-xs text-gray-500 uppercase tracking-wider">生产速率提升</div>
            </div>
             <div class="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
               <div class="absolute top-0 right-0 p-4 opacity-10">
                  <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
               </div>
               <div class="text-3xl font-black text-indigo-600 mb-1 font-mono">1/10</div>
               <div class="text-xs text-gray-500 uppercase tracking-wider">成本效益比</div>
            </div>
             <div class="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
               <div class="absolute top-0 right-0 p-4 opacity-10">
                  <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
               </div>
               <div class="text-3xl font-black text-indigo-600 mb-1 font-mono">4K</div>
               <div class="text-xs text-gray-500 uppercase tracking-wider">超高清输出</div>
            </div>
          </div>
          <br />
          <br />

          <hr class="my-20 border-gray-200 dark:border-gray-700" />
          <br />
          <br />

          <!-- Tech Stack -->
          <div class="mb-16">
             <h3 class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-8 flex items-center">
               <span class="w-1.5 h-8 bg-primary-600 mr-4 rounded-full"></span>
               核心架构 (Core Architecture)
             </h3>
             <br />
             <div class="grid grid-cols-1 gap-4">
                <div class="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                   <div class="font-mono text-indigo-600 mr-6 font-bold text-lg">L1</div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">主体冻结引擎 (Subject Lock)</div>
                      <div class="text-xs text-gray-500 font-mono mt-1">PROPRIETARY FEATURE PRESERVATION PROTOCOL</div>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">在重构环境的同时，确保输入产品的几何结构和材质细节 100% 保真。</p>
                   </div>
                </div>
                <div class="mt-4 flex items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border-l-4 border-purple-500 shadow-sm">
                   <div class="font-mono text-purple-600 mr-6 font-bold text-lg">L2</div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">Nano Banana2 Pro</div>
                      <div class="text-xs text-gray-500 font-mono mt-1">SOTA VISUAL & MULTIMODAL MODEL</div>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">搭载世界顶尖的视觉与多模态模型 Nano Banana2 Pro，精准理解光照、深度和材质属性。</p>
                   </div>
                </div>
                 <div class="mt-4 flex items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border-l-4 border-blue-500 shadow-sm">
                   <div class="font-mono text-blue-600 mr-6 font-bold text-lg">L3</div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">语义桥接 (Semantic Bridge)</div>
                      <div class="text-xs text-gray-500 font-mono mt-1">NLP TO VISUAL TRANSLATION</div>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">先进的自然语言理解技术，将营销意图精确转化为视觉构图。</p>
                   </div>
                </div>
             </div>
          </div>
          <br />
          <br />

          <hr class="my-20 border-gray-200 dark:border-gray-700" />
          <br />
          <br />

          <!-- Mission/Directives -->
          <div class="mb-16 mt-24">
            <h3 class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center">
               <span class="w-1.5 h-8 bg-primary-600 mr-4 rounded-full"></span>
               我们的使命 (Our Mission)
             </h3>
             <br />
             <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl">
               不再让视觉阻挡增长，让你的每个创意和想法都能落地。
             </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div class="backdrop-blur-md bg-gray-50/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                 <div class="font-mono text-xs text-gray-400 mb-2">MISSION_01</div>
                 <div class="font-bold text-lg text-gray-900 dark:text-white mb-2">赋能增长 (Empower Growth)</div>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">消除视觉制作成本壁垒，让品牌专注于核心业务增长。</p>
               </div>
               <div class="backdrop-blur-md bg-gray-50/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                 <div class="font-mono text-xs text-gray-400 mb-2">MISSION_02</div>
                 <div class="font-bold text-lg text-gray-900 dark:text-white mb-2">释放创意 (Unleash Creativity)</div>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">降低专业创作门槛，让每一个灵感都能被精准呈现。</p>
               </div>
               <div class="backdrop-blur-md bg-gray-50/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                 <div class="font-mono text-xs text-gray-400 mb-2">MISSION_03</div>
                 <div class="font-bold text-lg text-gray-900 dark:text-white mb-2">落地实效 (Drive Results)</div>
                 <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">不仅仅是生成图片，更是构建高转化率的商业视觉资产。</p>
               </div>
            </div>
          </div>


        `
      }
  }
};
