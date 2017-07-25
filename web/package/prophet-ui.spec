Name:      prophet-ui
Version:   %{version}
Release:   %{release}%{?dist}
Summary:   prophet ui
Group:       Development/Libraries
License:   MIT
URL:       http://prophet.com
Source0:   %{name}.tar.gz

%description
prophet ui build package

%prep

%build

%install
echo %{buildroot} 
echo %{SOURCE0}
mkdir %{buildroot}/usr/local/prophet-ui -p
tar xfz  %{SOURCE0} -C %{buildroot}/usr/local/prophet-ui

%clean
rm -rf %{buildroot}

%pre

%post

%files
%defattr(-,root,root)
/usr/local/prophet-ui

%changelog
