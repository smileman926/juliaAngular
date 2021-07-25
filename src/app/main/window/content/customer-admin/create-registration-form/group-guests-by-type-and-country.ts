import { GroupGuest } from '@/app/main/window/content/customer-admin/create-registration-form/models';

export function groupGuestsByTypeAndCountry(guests: GroupGuest[]): GroupGuest[] {
  const groupedGuests: GroupGuest[] = [];
  guests.forEach(guest => {
    guest.count = guest.count ? guest.count : 0;
    const existingGuestGroup = findExistingGuestGroup(guest, groupedGuests);
    if (existingGuestGroup) {
      if (existingGuestGroup.count === null) {
        existingGuestGroup.count = 0;
      }
      existingGuestGroup.count += guest.count;
    } else {
      groupedGuests.push(guest);
    }
  });
  return groupedGuests;
}

function findExistingGuestGroup(guest: GroupGuest, groupedGuests: GroupGuest[]): GroupGuest | undefined {
  return groupedGuests.find(groupedGuest => groupedGuest.taxTypeId === guest.taxTypeId && groupedGuest.countryId === guest.countryId);
}
