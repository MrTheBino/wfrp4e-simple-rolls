function processRollResult(targetValue,roll){
  let messageText = "";
  let numDigits = (''+ roll.total).length;

  // messageText += "<br>Num Digits: " + numDigits;
  // messageText += "<br>Tens Place Target: " + getTensPlace(targetValue);
  // messageText += "<br>Tens Place Roll: " + getTensPlace(roll.result);

  let targetTensPlace = getTensPlace(targetValue);
  let rollTensPlace = getTensPlace(roll.total);
  let successLevel = targetTensPlace - rollTensPlace;

  let isSuccess = false;
  if(roll.total <= targetValue)
  {
    isSuccess = true;
  }

  // automatic failure & success
  let autoFailure = false;
  let autoSuccess = false;

  if(roll.total >= 96 && roll.total <= 100){
    autoFailure = true;
    isSuccess = false;
  }

  if(roll.total >= 1 && roll.total <= 5){
    autoSuccess = true;
    isSuccess = true;
  }

  // pasch, roll result is double?
  let rollIsDouble = isNumberDouble(roll.total);

  // chat output
  messageText = '<div class="dice-roll">';

  messageText += '<div class="dice-result">';
  if(isSuccess){
    messageText += "<h4 class='dice-total' style='color:green;'>"+roll.total+"</h4>";
  }else{
    messageText += "<h4 class='dice-total' style='color:red;'>"+roll.total+"</h4>";
  }
  messageText += '</div>';
  
  messageText += '<div class="dice-formula">';
  messageText += "You rolled d100= <strong>"+ roll.total + "</strong> against a target of <strong>" + targetValue + "</strong>";
  messageText += "<br>The Success Level: " + targetTensPlace +" - " + rollTensPlace + " = <strong>" + successLevel+"</strong>";
  messageText += "<br>"+getHitzoneString(roll.total);

  if(isSuccess == false && rollIsDouble){
    messageText += "<br><strong style='color:red'>FUMBLE</strong>";
  }

  if(isSuccess == true && rollIsDouble){
    messageText += "<br><strong style='color:green'>CRITICAL HIT</strong>";
  }

  if(autoFailure){
    messageText += "<br><strong style='color:red'>AUTOMATIC FAILURE</strong>";
  }
  if(autoSuccess){
    messageText += "<br><strong style='color:green'>AUTOMATIC SUCCESS</strong>";
  }

  messageText += '</div>';

  messageText += "</div>";
  
  return messageText;
}

function getHitzoneString(v){
  let hzn = 0;
  if(v == 0){
    hzn = 100;
  }else{
    if(v >= 10){
      let d1 = parseInt(String(v)[0]);
      let d2 = parseInt(String(v)[1]);
      hzn = parseInt(d2+""+d1);
    }else{
      hzn = v * 10;
    }
  }

  if(hzn >= 1 && hzn <= 9){
    return "("+hzn+": striking at the head)";
  }

  if(hzn >= 10 && hzn <= 24){
    return "("+hzn+": striking at the left arm)";
  }

  if(hzn >= 25 && hzn <= 44){
    return "("+hzn+": striking at the right arm)";
  }

  if(hzn >= 45 && hzn <= 79){
    return "("+hzn+": striking at the body)";
  }

  if(hzn >= 80 && hzn <= 89){
    return "("+hzn+": striking at the left leg)";
  }

  if(hzn >= 90 && hzn <= 100){
    return "("+hzn+": striking at the right leg)";
  }

  return "("+hzn+": striking unknown)";
}

function isNumberDouble(v){
  if(v == 0){
    return true;
  }else{
    if(v >= 10){
      let d1 = parseInt(String(v)[0]);
      let d2 = parseInt(String(v)[1]);
      if(d1 == d2){
        return true;
      }
    }
  }

  return false;
}

function getTensPlace(v){
  let numDigits = (''+ v).length;
  if(numDigits == 1){
    return 0;
  }else{
    return parseInt(String(v)[0]);
  }
}

Hooks.on("chatCommandsReady", function(chatCommands) {

  chatCommands.registerCommand(chatCommands.createCommandFromData({
    commandKey: "/wr",
    invokeOnCommand: (chatlog, messageText, chatdata) => {
      
      let rollCmd = "1d100"
      let r = new Roll(rollCmd);
      
      
      r.evaluate({async: false});

      let formulaRoll = new Roll(messageText);
      formulaRoll.evaluate({async: false});
      
      //console.log(chatdata);
      chatdata.roll = r;
      chatdata.type =  CONST.CHAT_MESSAGE_TYPES.ROLL;
      return processRollResult(formulaRoll.total,r);
    },
    shouldDisplayToChat: true,
    iconClass: "fa-dice-d20",
    description: "WFRP4E roll with success level etc.",
    gmOnly: false
  }));
});