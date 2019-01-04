var app = angular.module("myApp", []);

app.controller("myController", function($scope, $http) {

    $scope.calculo = {
        selic: {},
        lcilca: {},
        pre: {},
        pos: {}
    };

    $scope.indices = {
        selic:  0,
        cdi:    0,
        ipca:   0,
        poupanca:   0.3715
    };

    $scope.conversao = {
        ao_ano: {
            v1: 0.00, v2: 0.00, v3: 0.00
        },
        ao_mes: {
            v1: 0.00, v2: 0.00, v3: 0.00
        },
        ao_dia: {
            v1: 0.00, v2: 0.00, v3: 0.00
        }
    }

    $scope.valores = {
        investimento: 1000.0,
        periodo: 365,
        percentual_cdi_oferecido_cdb: 120.0,
        percentual_cdi_oferecido_lcilca: 95.0,
        percentual_oferecido_pre: 8.14
    }

    $scope.init = function() {
        console.log('init...');

        $http.get('/indices/selic').then(function(response) {
            //console.log(response.data);
            $scope.indices.selic = response.data;
        });

        $http.get('/indices/cdi').then(function(response) {
            //console.log(response.data);
            $scope.indices.cdi = response.data;
        });

        $http.get('/indices/ipca').then(function(response) {
            //console.log(response.data);
            $scope.indices.ipca = response.data;
        });
    }

    //=pow(B4+1;1/252)-1
    function calculaPercentualDiarioBruto(percentual) {
        return Math.pow(percentual+1, 1/252) - 1;
    }

    //http://financeformulas.net/Future_Value.html
    function fv(valor, taxa, periodo) {
        return valor * Math.pow(1 + taxa, periodo); 
    }

    function calculaDiasUteis(v) {
        return v / 365 * 252;
    }

    //=IF(B8>720;15%;IF(B8>360;17,5%;IF(B8>180;20%;22,5%)))
    function calculaAliquotaIR(periodo) {
        if(periodo>720) {
            return 0.15;
        } else {
            if(periodo>360) {
                return 0.175;
            } else {
                if(periodo>180) {
                    return 0.20;
                } else {
                    return 0.225;
                }
            }
        }
    }

    function atualizaCalculo() {
        // geral
        $scope.calculo.dias_uteis =  calculaDiasUteis($scope.valores.periodo);
        $scope.calculo.aliquota_ir =  calculaAliquotaIR($scope.valores.periodo);
        $scope.valores.anos = $scope.valores.periodo / 360.0

        // selic
        $scope.calculo.selic.percentual_diario_bruto =  calculaPercentualDiarioBruto($scope.indices.cdi / 100.0);
        $scope.calculo.selic.valor_futuro_bruto =  fv($scope.valores.investimento, 
            $scope.calculo.selic.percentual_diario_bruto, $scope.calculo.dias_uteis);
        $scope.calculo.selic.ir = ($scope.calculo.selic.valor_futuro_bruto - $scope.valores.investimento) * $scope.calculo.aliquota_ir;
        $scope.calculo.selic.valor_futuro_liquido = $scope.calculo.selic.valor_futuro_bruto - $scope.calculo.selic.ir;
        $scope.calculo.selic.lucro_liquido_total = $scope.calculo.selic.valor_futuro_liquido - $scope.valores.investimento;
        $scope.calculo.selic.percentual_liquido_total = $scope.calculo.selic.lucro_liquido_total / $scope.valores.investimento;
        $scope.calculo.selic.percentual_liquido_ano = Math.pow($scope.calculo.selic.percentual_liquido_total + 1, 1/$scope.calculo.dias_uteis * 252) - 1;
        $scope.calculo.selic.percentual_liquido_mes = Math.pow($scope.calculo.selic.percentual_liquido_ano + 1, 1/12) - 1;

        // lci/lca
        $scope.calculo.lcilca.percentual_diario_bruto =  calculaPercentualDiarioBruto($scope.indices.cdi * ($scope.valores.percentual_cdi_oferecido_lcilca / 100.0) / 100.0);
        $scope.calculo.lcilca.valor_futuro_bruto =  fv($scope.valores.investimento, 
            $scope.calculo.lcilca.percentual_diario_bruto, $scope.calculo.dias_uteis);
        $scope.calculo.lcilca.valor_futuro_liquido = $scope.calculo.lcilca.valor_futuro_bruto;
        $scope.calculo.lcilca.lucro_liquido_total = $scope.calculo.lcilca.valor_futuro_liquido - $scope.valores.investimento;
        $scope.calculo.lcilca.percentual_liquido_total = $scope.calculo.lcilca.lucro_liquido_total / $scope.valores.investimento;
        $scope.calculo.lcilca.percentual_liquido_ano = Math.pow($scope.calculo.lcilca.percentual_liquido_total + 1, 1/$scope.calculo.dias_uteis * 252) - 1;
        $scope.calculo.lcilca.percentual_liquido_mes = Math.pow($scope.calculo.lcilca.percentual_liquido_ano + 1, 1/12) - 1;

        // pré
        $scope.calculo.pre.percentual_diario_bruto =  calculaPercentualDiarioBruto($scope.valores.percentual_oferecido_pre / 100.0);
        $scope.calculo.pre.valor_futuro_bruto =  fv($scope.valores.investimento, 
            $scope.calculo.pre.percentual_diario_bruto, $scope.calculo.dias_uteis);
        $scope.calculo.pre.ir = ($scope.calculo.pre.valor_futuro_bruto - $scope.valores.investimento) * $scope.calculo.aliquota_ir;
        $scope.calculo.pre.valor_futuro_liquido = $scope.calculo.pre.valor_futuro_bruto - $scope.calculo.pre.ir;
        $scope.calculo.pre.lucro_liquido_total = $scope.calculo.pre.valor_futuro_liquido - $scope.valores.investimento;
        $scope.calculo.pre.percentual_liquido_total = $scope.calculo.pre.lucro_liquido_total / $scope.valores.investimento;
        $scope.calculo.pre.percentual_liquido_ano = Math.pow($scope.calculo.pre.percentual_liquido_total + 1, 1/$scope.calculo.dias_uteis * 252) - 1;
        $scope.calculo.pre.percentual_liquido_mes = Math.pow($scope.calculo.pre.percentual_liquido_ano + 1, 1/12) - 1;

        // pós
        $scope.calculo.pos.percentual_diario_bruto =  calculaPercentualDiarioBruto($scope.indices.cdi * ($scope.valores.percentual_cdi_oferecido_cdb / 100.0) / 100.0);
        $scope.calculo.pos.valor_futuro_bruto =  fv($scope.valores.investimento, 
            $scope.calculo.pos.percentual_diario_bruto, $scope.calculo.dias_uteis);
        $scope.calculo.pos.ir = ($scope.calculo.pos.valor_futuro_bruto - $scope.valores.investimento) * $scope.calculo.aliquota_ir;
        $scope.calculo.pos.valor_futuro_liquido = $scope.calculo.pos.valor_futuro_bruto - $scope.calculo.pos.ir;
        $scope.calculo.pos.lucro_liquido_total = $scope.calculo.pos.valor_futuro_liquido - $scope.valores.investimento;
        $scope.calculo.pos.percentual_liquido_total = $scope.calculo.pos.lucro_liquido_total / $scope.valores.investimento;
        $scope.calculo.pos.percentual_liquido_ano = Math.pow($scope.calculo.pos.percentual_liquido_total + 1, 1/$scope.calculo.dias_uteis * 252) - 1;
        $scope.calculo.pos.percentual_liquido_mes = Math.pow($scope.calculo.pos.percentual_liquido_ano + 1, 1/12) - 1;

        // debug
        console.log($scope.calculo);
    }

    /**
     * 
     */
    function calculaConversao() {
        // coluna 1
        $scope.conversao.ao_mes.v1 = (Math.pow(1 + $scope.conversao.ao_ano.v1 / 100.0, 1/12) - 1) * 100.0;
        $scope.conversao.ao_dia.v1 = (Math.pow(1 + $scope.conversao.ao_mes.v1 / 100.0, 1/21) - 1) * 100.0;

        // coluna 2
        $scope.conversao.ao_ano.v2 = (Math.pow(1 + $scope.conversao.ao_mes.v2 / 100.0, 12) - 1) * 100.0;
        $scope.conversao.ao_dia.v2 = (Math.pow(1 + $scope.conversao.ao_mes.v2 / 100.0, 1/21) - 1) * 100.0;

        // coluna 3        
        $scope.conversao.ao_mes.v3 = (Math.pow(1 + $scope.conversao.ao_dia.v3 / 100.0, 21) - 1) * 100.0;
        $scope.conversao.ao_ano.v3 = (Math.pow(1 + $scope.conversao.ao_mes.v3 / 100.0, 12) - 1) * 100.0;
    }

    /*
        WATCHERS
    */
    $scope.$watch('valores.periodo', atualizaCalculo);
    $scope.$watch('valores.investimento', atualizaCalculo);
    $scope.$watch('valores.percentual_cdi_oferecido_cdb', atualizaCalculo);
    $scope.$watch('valores.percentual_cdi_oferecido_lcilca', atualizaCalculo);
    $scope.$watch('valores.percentual_oferecido_pre', atualizaCalculo);

    $scope.$watch('conversao.ao_ano.v1', calculaConversao);
    $scope.$watch('conversao.ao_mes.v2', calculaConversao);
    $scope.$watch('conversao.ao_dia.v3', calculaConversao);
});
