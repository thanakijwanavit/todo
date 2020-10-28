#!/bin/bash
docker build . -t thanakijwanavit/serverless
docker run -v $(pwd):/workdir -v $HOME/.aws/credentials:/root/.aws/credentials -w="/workdir" thanakijwanavit/serverless $@
