/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import { IonButton, IonCheckbox, IonIcon, IonInput, IonItem, IonLabel, IonTextarea } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import Avatar from "../../../../components/Avatar";
import UploadImage from "../../../../components/UploadImage";
import { sessionStore } from "../../../../domains/auth/sessionStore";
import { currentUserStore } from "../../../../domains/currentUser/currentUserStore";
import { formatDateLLLLddyyyy } from "../../../../domains/date/timezone";
import { IMAGE_SIZE } from "../../../../domains/image";
import { showToast } from "../../../../domains/ui/toast";
import { getPublicUrl, profilePicturePath } from "../../../../queries/image";
import {
  acceptTerms,
  changeBio,
  changeEmail,
  changeHandle,
  changeName,
  useProfileQuery
} from "../../../../queries/profileByUserId";
import { useNavigate, useParams } from "../../../../router"

type Props = {
  canEdit?: boolean;
  userId: string;
  initial?: boolean;
  acceptedAt?: string;
}

export function UserView({ canEdit, userId, initial, acceptedAt }: Props) {
  const { data: user, isLoading } = useProfileQuery(userId);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [profilePicture, setProfilePicture] = useState(getPublicUrl(profilePicturePath(userId)));
  const [tempBase64Image, setTempBase64Image] = useState<string | null>(null);
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (isLoading || !user) {
    return <div>Loading...</div>
  }

  if (canEdit) {
    return (
      <div className="flex w-full justify-center overflow-auto">
        <div className="max-w-[800px] w-full p-2 flex flex-col gap-6">
          {!initial && <div>
            <IonIcon className='cursor-pointer text-4xl'
              icon={arrowBack} onClick={() => { navigate('/home') }} />
          </div>}
          {initial && (
            <div className='pb-4'>
              We require you to fill out your profile to continue.
              Once the required fields are filled out, you will be taken back to where you were.
              Edit any time by expanding the profile icon in the top left corner.
            </div>
          )}
          <div className='flex flex-col gap-4'>
            <div className='text-3xl'>
              Personal Profile
            </div>
            <div className='flex flex-col items-center'>
              <Avatar
                src={tempBase64Image || profilePicture}
                alt={user.handle}
                size={IMAGE_SIZE.AVATAR_LARGE} />
              {!isEditingPhoto && (
                <IonButton color='secondary'
                  className='flex pb-4'
                  onClick={() => { setIsEditingPhoto(true) }}>
                  Change picture
                </IonButton>
              )}
              {isEditingPhoto && (
                <UploadImage path={profilePicturePath(userId)}
                  onChange={image => { setTempBase64Image(image) }}
                  close={() => {
                    setProfilePicture(
                      `${getPublicUrl(profilePicturePath(userId))}?
                      ${new Date().getTime().toString()}`)
                    setIsEditingPhoto(false)
                  }} />
              )}
            </div>
            <IonItem>
              <IonInput label='First name*'
                value={user.sensitive_profile[0]?.first_name}
                onIonChange={(e) => { void changeName(userId, { firstName: e.detail.value }) }}
              />
            </IonItem>
            <IonItem>
              <IonInput label='Last name*'
                value={user.sensitive_profile[0]?.last_name}
                onIonChange={(e) => { void changeName(userId, { lastName: e.detail.value }) }}
              />
            </IonItem>
            <IonItem>
              <IonInput label='Email*'
                value={user.sensitive_profile[0]?.email}
                onIonChange={(e) => { void changeEmail(userId, e.detail.value) }}
              />
            </IonItem>
            <IonItem>
              <IonInput label='Diplay name*'
                value={user.handle}
                onIonChange={(e) => { void changeHandle(userId, e.detail.value) }}
              />
            </IonItem>
            <IonItem>
              <IonLabel className='whitespace-nowrap'>Display bio</IonLabel>
              <IonTextarea
                value={user.bio}
                onIonChange={(e) => { void changeBio(userId, e.detail.value) }}
                rows={5}
              />
            </IonItem>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='text-3xl'>
              Terms and conditions
            </div>
            <div>
              <div className='text-2xl'>Community Pledge</div>
              I pledge to use Serve to be Free for good.
            </div>
            <div>
              <div className='text-2xl'>Code of Conduct</div>
              <br />At Serve To Be Free (STBF), we are committed to fostering a positive and inclusive community where all participants feel valued, respected, and supported. As a member of our platform, you agree to uphold the following code of conduct:
              <br /><br />Respect: Treat all participants with kindness, empathy, and respect, regardless of their background, beliefs, or opinions. We celebrate diversity and encourage open-mindedness in all interactions.
              <br /><br />Inclusivity: Embrace and support individuals from all walks of life, including those with diverse abilities, cultures, genders, sexual orientations, and identities. Everyone has a unique perspective to contribute, and we welcome them with open arms.
              <br /><br />Collaboration: Foster a spirit of collaboration and teamwork in all projects and activities. Work together towards common goals, share ideas constructively, and empower each other to succeed.
              <br /><br />Communication: Communicate openly, honestly, and transparently with fellow participants. Listen actively, give and receive feedback respectfully, and address any conflicts or concerns promptly and professionally.
              <br /><br />Safety: Prioritize the safety and well-being of all participants at all times. Report any inappropriate or harmful behavior to STBF administrators immediately, and refrain from engaging in any actions that could jeopardize the safety of others.
              <br /><br />Integrity: Act with integrity and honesty in all your interactions on the platform. Uphold the values of trustworthiness, accountability, and ethical conduct, and strive to build a community founded on mutual respect and integrity.
              <br /><br />Privacy: Respect the privacy and confidentiality of fellow participants. Do not share personal information or sensitive data without consent, and abide by STBF's privacy policies and guidelines at all times.
              <br /><br />Non-Discrimination: Refrain from engaging in discrimination, harassment, or bullying of any kind. STBF is a safe and inclusive space for all, and discriminatory behavior will not be tolerated under any circumstances.
              <br /><br />Compliance: Adhere to all applicable laws, regulations, and guidelines governing your participation in STBF activities. Respect intellectual property rights, including copyrights and trademarks, and refrain from engaging in any illegal or unethical conduct.
              <br /><br />Contribution: Contribute positively to the STBF community by actively participating in projects, offering support and encouragement to fellow participants, and promoting a culture of kindness, generosity, and service.
              <br /><br />By participating in Serve To Be Free, you agree to abide by this code of conduct and uphold the values and principles it represents. Together, let's create a welcoming, inclusive, and empowering community where everyone can thrive and make a difference! 🌟
            </div>
            <div>
              <div className='text-2xl'>Privacy Policy</div>
              <br />This Privacy Policy describes how ServeToBeFree.org ("STBF," "we," "us," or "our") collects, uses, and shares your personal information when you use our website and services (collectively, the "Service").
              <br /><br />1. Information We Collect
              <br />a. Information You Provide: When you register for an account, participate in projects, or communicate with us, we may collect personal information such as your name, email address, and other contact details.
              <br />b. Automatically Collected Information: We may automatically collect certain information about your device and usage of the Service, including your IP address, browser type, operating system, and interactions with the Service.
              <br /><br />2. How We Use Your Information
              <br />We may use the information we collect for the following purposes:
              <br />a. To provide and maintain the Service. b. To communicate with you about your account and the Service. c. To personalize your experience and improve the Service. d. To analyze usage trends and optimize the Service. e. To comply with legal obligations.
              <br /><br />3. Sharing of Your Information
              <br />We may share your personal information with third parties for the following purposes:
              <br />a. With service providers who assist us in operating the Service. b. With project leaders and sponsors to facilitate your participation in projects. c. With law enforcement or government agencies as required by law.
              <br /><br />4. Your Choices
              <br />You may update or delete your account information at any time by logging into your account settings. You may also opt-out of receiving certain communications from us by following the instructions provided in those communications.
              <br /><br />5. Security
              <br />We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, so we cannot guarantee absolute security.
              <br /><br />6. Children's Privacy
              <br />The Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete the information.
              <br /><br />7. Changes to This Privacy Policy
              <br />We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              <br /><br />8. Contact Us
              <br />If you have any questions about this Privacy Policy, please contact us at support@servetobefree.org
            </div>

            <div>
              <div className='text-2xl'>Other conditions</div>
              <br />This User Agreement is a legal agreement between you ("User" or "you") and ServeToBeFree.org ("STBF") governing your use of the STBF platform and services. By accessing or using STBF, you agree to be bound by the terms and conditions of this Agreement.
              <br /><br />1. Acceptance of Terms: By accessing or using STBF, you acknowledge that you have read, understood, and agree to be bound by this Agreement and any additional terms and policies referenced herein or available through hyperlinks. If you do not agree to these terms, you may not use STBF.
              <br /><br />2. Registration and Account: You must register for an account to access certain features of STBF. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              <br /><br />3. Use of Services: Subject to your compliance with this Agreement, STBF grants you a limited, non-exclusive, non-transferable, revocable license to access and use STBF solely for your personal, non-commercial use. You may not use STBF for any unlawful or unauthorized purpose.
              <br /><br />4. Content: You retain ownership of any content you submit or upload to STBF. By submitting or uploading content, you grant STBF a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content for the purpose of operating and improving STBF.
              <br /><br />5. Intellectual Property: STBF and its content, including but not limited to text, graphics, logos, images, and software, are the property of STBF or its licensors and are protected by copyright, trademark, and other intellectual property laws.
              <br /><br />6. Privacy: STBF's Privacy Policy governs the collection, use, and disclosure of your personal information. By using STBF, you consent to the collection, use, and disclosure of your personal information as described in the Privacy Policy.
              <br /><br />7. Disclaimer of Warranties: STBF is provided on an "as is" and "as available" basis without any warranties of any kind. STBF disclaims all warranties, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              <br /><br />8. Limitation of Liability: In no event shall STBF be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with your use of STBF.
              <br /><br />9. Indemnification: You agree to indemnify and hold STBF and its affiliates, osfficers, directors, employees, and agents harmless from any and all claims, liabilities, damages, costs, and expenses, including reasonable attorneys' fees, arising out of or in connection with your use of STBF or any violation of this Agreement.
              <br /><br />10. Termination: STBF may terminate or suspend your access to STBF at any time, with or without cause, and without prior notice or liability.
              <br /><br />11. Governing Law: This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles.
              <br /><br />12. Changes to Terms: STBF reserves the right to modify or revise this Agreement at any time. We will notify you of any changes by posting the revised Agreement on STBF or by sending you an email. Your continued use of STBF after any such changes constitutes your acceptance of the revised Agreement.
              <br /><br />13. Entire Agreement: This Agreement constitutes the entire agreement between you and STBF regarding your use of STBF and supersedes all prior or contemporaneous agreements, understandings, and communications, whether oral or written.
              <br /><br />14. Contact Information: If you have any questions about this Agreement, please contact us at support@servetobefree.org
              <br /><br />By using STBF, you acknowledge that you have read, understood, and agree to be bound by this Agreement.
            </div>
          </div>
          {/* Initial */}
          {initial && (
            <>
              <IonItem>
                <IonLabel onClick={() => {
                  setAcceptedTerms(!acceptedTerms)
                }}>I accept terms and conditions*</IonLabel>
                <IonCheckbox
                  checked={!!acceptedTerms}
                  onIonChange={(e) => {
                    setAcceptedTerms(e.detail.checked)
                  }}
                />
              </IonItem>
              <IonButton disabled={!acceptedTerms} className='p-4 self-end' onClick={() => {
                void acceptTerms(userId).then(() => {
                  showToast('Thank you for joining us')
                })
              }}>Accept</IonButton>
            </>
          )}
          {/* Not initial */}
          {!initial && acceptedAt && (
            <>
              <IonItem disabled>
                <IonLabel>I accepted terms and conditions</IonLabel>
                <div>{formatDateLLLLddyyyy(acceptedAt)}</div>
              </IonItem>
              <IonButton className='p-4 self-end' onClick={() => { navigate('/home') }}>Home</IonButton>
            </>
          )}
          <br />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full justify-center">
      <div className="max-w-[800px] w-full p-2">
        <div>
          <IonIcon className='cursor-pointer text-4xl'
            icon={arrowBack} onClick={() => { navigate('/home') }} />
        </div>
        <div>
          <div className='text-3xl'>
            Profile
          </div>
          <Avatar
            src={tempBase64Image || profilePicture}
            alt={user.handle}
            size={IMAGE_SIZE.AVATAR_LARGE} />
          <div>Display name: {user.handle}</div>
        </div>
        <div>
          <div className='text-2xl'>
            Bio
          </div>
          <div>{user.bio}</div>
        </div>
      </div>
    </div>
  )
}

export const UserViewPage = observer(() => {
  const { userId } = useParams('/user/:userId/view')
  const currentUserId = sessionStore.current?.user.id;

  return (
    <UserView
      userId={userId}
      canEdit={userId === currentUserId}
      acceptedAt={currentUserStore.acceptedAt} />
  )
});

export default UserViewPage;
