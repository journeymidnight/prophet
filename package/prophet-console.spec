Name:      prophet-console
Version:   %{version}
Release:   %{release}%{?dist}
Summary:   prophet console
Group:       Development/Libraries
License:   MIT
URL:       http://prophet.com
Source0:   %{name}.tar.gz
BuildRoot:    %(mktemp -ud %{_tmppath}/%{name}-%{version}-%{release}-XXXXXX)
#Requires:     striprados

%description
prophet console build package

%prep

%build
make

%install
rm -rf %{buildroot}
install -D -m 755 prophet %{buildroot}%{_bindir}/prophet
install -D -m 755 %{_builddir}/prophet-%{version}-%{rel}/build/bin/prophet %{buildroot}%{_bindir}/prophet
install -D -m 644 package/prophet.logrotate %{buildroot}/etc/logrotate.d/prophet.logrotate
install -D -m 644 package/prophet.service   %{buildroot}/usr/lib/systemd/system/prophet.service
install -D -m 644 conf/prophet.json %{buildroot}%{_sysconfdir}/prophet/prophet.json
install -d %{buildroot}/var/log/prophet/

%clean
rm -rf %{buildroot}

%pre

%post
systemctl enable prophet

%files
%defattr(-,root,root)
%config(noreplace) /etc/prophet/prophet.json
/usr/bin/prophet
/etc/logrotate.d/prophet.logrotate
%dir /var/log/prophet/
/usr/lib/systemd/system/prophet.service

%changelog
