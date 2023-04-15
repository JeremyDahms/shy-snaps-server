#!/bin/bash

# Install required dependencies for the "sharp" package
sudo yum install -y epel-release
sudo yum install -y gcc-c++ make
sudo yum install -y vips vips-devel

# Refresh the environment
. /opt/elasticbeanstalk/env.vars