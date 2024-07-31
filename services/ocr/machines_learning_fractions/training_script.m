ld = load("Fractions.mat");
gTruth = ld.gTruth;

labelName = "one_half";
attributeName = "Text";
[imds,boxds,txtds] = ocrTrainingData(gTruth,labelName,attributeName);

cds = combine(imds,boxds,txtds);

disp(['Number of images: ', num2str(numel(imds.Files))]);
disp(boxds);
disp(txtds);


% Set the random number seed for reproducibility.
rng(0); 

% Compute number of training and validation samples.
trainingToValidationRatio = 0.8;
numSamples = height(ld.gTruth.LabelData);
numTrainSamples = ceil(trainingToValidationRatio*numSamples);

% Divide the dataset into training and validation.
indices = randperm(numSamples);
trainIndices = indices(1:numTrainSamples);
validationIndices = indices(numTrainSamples+1:end);

% Display the number of samples in each subset
disp(['Number of training samples: ', num2str(numel(trainIndices))]);
disp(['Number of validation samples: ', num2str(numel(validationIndices))]);

cdsValidation = subset(cds, validationIndices);
cdsTrain = subset(cds, trainIndices);

outputDir = "OCRModel";
if ~exist(outputDir, "dir")
    mkdir(outputDir);
end

checkpointsDir = "Checkpoints";
if ~exist(checkpointsDir, "dir")
    mkdir(checkpointsDir);
end

ocrOptions = ocrTrainingOptions(GradientDecayFactor=0.9, ...
    InitialLearnRate=40e-4, MaxEpochs=10, VerboseFrequency=160, ...
    CheckpointPath=checkpointsDir, ValidationData=cdsValidation, ...
    OutputLocation=outputDir);

outputModelName = "one_half";
baseModel = "english";
outputModel = trainOCR(cdsTrain, outputModelName, baseModel, ocrOptions);