class AppURL {
    static BaseURL = "https://minh-nail-admin.beauty/api";
    // static BaseURL = "http://127.0.0.1:8001/api";

    static BusinessInfo = this.BaseURL + '/business/info';
    static ServiceAll = this.BaseURL + '/service/all';
    static StaffAll = this.BaseURL + '/staff/all';

    static StaffsByService(serviceId) {
        return this.BaseURL + '/staff-by-service/' + serviceId;
    }

    static TimeSlotByStaff(day, staffId) {
        return this.BaseURL + '/timeslots-by-staff/' + day + '/' + staffId;
    }

    static ServicesByStaff(staffId) {
        return this.BaseURL + '/service-by-staff/' + staffId;
    }

    static StoreAppointment = this.BaseURL + '/appointment/store';

    static CancelAppointment(appointmentId) {
        return this.BaseURL + '/appointment/cancel/' + appointmentId;
    }

    static SlotTimeCheck(date) {
        return this.BaseURL + '/slotime/check/' + date;
    }
}

export default AppURL