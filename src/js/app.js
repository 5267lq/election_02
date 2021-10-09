App={
    web3Provider:null,
    contracts:{},

    init:async function(){
        return await App.initWeb3();
    },
    initWeb3:async function(){
        if(window.ethereum){
            App.web3Provider=window.ethereum;
            try{
                await window.ethereum.enable();
            }catch(error){
                console.log("User denied account access.");
            }
        }
        else if(window.web3){
            App.web3Provider=window.web3.currentProvider;
        }
        else{
            App.web3Provider=new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        }
        web3=new Web3(App.web3Provider);
        return App.initContract();
    },
    initContract:function(){
        $.getJSON("Election.json",function(election){
            App.contracts.Election=TruffleContract(election);
            App.contracts.Election.setProvider(App.web3Provider);
            //
            return App.render();
        });
    },
    render:function(){
        var electionInstance;
        App.contracts.Election.deployed().then(function(instance){
            electionInstance=instance;
            return electionInstance.candidateCount();
        }).then(function(candidateCount){
            var candidateResult=$("#candidateResult");
            candidateResult.empty();
            var candidateSelect=$("#candidateSelect");
            candidateSelect.empty();
            for(var i=1;i<=candidateCount;i++){
                electionInstance.candidates(i).then(function(candidate){
                    var id=candidate[0];
                    var name=candidate[1];
                    var voteCount=candidate[2];
                    var candidateTemplate="<tr><th>"+id+"</th><td>"+name+"</td><td>"+voteCount+"</td></tr>";
                    candidateResult.append(candidateTemplate);
                    var candidateOption="<option value='"+id+"'>"+name+"</option>";
                    candidateSelect.append(candidateOption);
                })
            }
        })
    }
};

$(function(){
    $(window).load(function(){
        App.init();
    });
});