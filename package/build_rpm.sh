#!/bin/bash
set -e -x

package_name=prophet-console

echo 'prepare...'
GITROOT=`git rev-parse --show-toplevel`
rpmbuild_dir=$GITROOT/rpmbuild
PWD=`pwd`
REL=`git rev-parse --short HEAD`git
REL=`git log --oneline|wc -l`.$REL
version=0.1
release=$REL
spec=$package_name.spec
mkdir -p $rpmbuild_dir/{SOURCES,SPECS}
cp $spec $rpmbuild_dir/SPECS
sed -i "2i\%define version ${version}\n%define release ${release}" $rpmbuild_dir/SPECS/$spec
echo 'rpmbuild...'
cd $GITROOT
git archive --format=tar --prefix=${package_name}-${version}-${release}/ HEAD | gzip -c > $rpmbuild_dir/SOURCES/${package_name}-${version}-${release}.tar.gz
cd package
rpmbuild \
--define "_topdir $rpmbuild_dir" \
--define "_rpmdir $PWD" \
--define "_srcrpmdir $PWD" \
--define '_rpmfilename %%{NAME}-%%{VERSION}-%%{RELEASE}.%%{ARCH}.rpm' \
-ba $rpmbuild_dir/SPECS/${package_name}.spec &&
echo Done

