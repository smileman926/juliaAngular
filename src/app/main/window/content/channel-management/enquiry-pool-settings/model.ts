import { Trigger } from '@/app/main/models';

export interface EnquiryPoolSettingsModel {
  c_epSettingAutoAnswerComment: Trigger;
  c_epSettingAutoAnswerDeskline: Trigger;
  c_epSettingAutoAnswerEnquiryForm: Trigger;
  c_epSettingFormDayTolerance: string;
  c_epSettingManualAssignDayTolerance: string;
  c_epSettingSplitToMultipleRooms: Trigger;
  id: string;
}
