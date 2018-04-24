function jacobi() {
  hideSteps();
  hidePlot();
  let origin = getTableValues();
  let bVector = getTableValues((id = "bvector-input"));
  let xVector = getTableValues((id = "xvector-input"));
  let error = getFloatValue((id = "error"));
  let maxIter = getFloatValue((id = "iterations"));
  let xTrack = [];
  let newX = [];
  let oldX = [];
  let actualError = 0;

  origin = [[10, 2, 1], [1, 5, 1], [2, 3, 10]];

  bVector = [[7], [-8], [6]];

  xVector = [[0.7], [-1.6], [0.6]];

  error = 0.05;
  maxIter = 10;

  if (
    origin == null ||
    bVector == null ||
    xVector == null ||
    error == null ||
    maxIter == null
  ) {
    alert("Preencha todos os campos!");
    return;
  } else if (
    isNullMatrix(origin) ||
    isNullMatrix(bVector) ||
    isNullMatrix(xVector)
  ) {
    alert("Nenhuma matriz não pode ser nula!");
    return;
  } else if (math.det(origin) == 0) {
    alert("É uma matriz singular. O determinante da matriz é 0");
    return;
  } else if (!rowCriterion(origin)) {
    alert("A matriz não atende ao Critério de Linha");
    return;
  }

  bVector = toArray(bVector);
  xVector = toArray(xVector);
  oldX = xVector.slice();
  newX = xVector.slice();

  xTrack.push(xVector.slice());

  showSystem(origin, bVector);

  //matriz com os valores dividios pelo elemento da diagonal
  let matrixMult = copyMatrix(origin);

  for (let i = 0; i < origin.length; i++) {
    for (let j = 0; j < origin[i].length; j++) {
      if (j != i) {
        matrixMult[i][j] =
          Math.round(origin[i][j] / origin[i][i] * 1000) / 1000;
      }
    }
  }

  showIteractionFuntion(origin, matrixMult, bVector);

  //iterações do método de Jacobi
  let k = -1;
  let newValue = 0;
  let newValueEquation = "";
  let newValueEquationWValues = "";
  let equation = "";
  let equationWValues = "";
  let equationResult = "";
  let finalEquations = [];

  do {
    k++;
    oldX = newX.slice();

    newValue = 0;
    newValueEquation = "";
    newValueEquationWValues = "";
    equation = "";
    equationWValues = "";
    equationResult = "";
    finalEquations = [];

    for (let i = 0; i < oldX.length; i++) {
      newValue = Math.round(bVector[i] / origin[i][i] * 1000) / 1000;
      newValueEquation = underIndex("b", i + 1);
      newValueEquationWValues = newValue;

      for (let j = 0; j < oldX.length; j++) {
        if (j != i) {
          newValue -= Math.round(matrixMult[i][j] * oldX[j] * 1000) / 1000;
          newValueEquation +=
            " - " +
            negative(matrixMult[i][j]) +
            underIndex("x", j + 1) +
            "^{(" +
            k +
            ")}";
          newValueEquationWValues +=
            " - " + negative(matrixMult[i][j]) + "(" + oldX[j] + ")";
        }
      }

      newX[i] = Math.round(newValue * 1000) / 1000;

      equation =
        underIndex("x", i + 1) + "^{(" + (k + 1) + ")} = " + newValueEquation;
      equationWValues =
        underIndex("x", i + 1) +
        "^{(" +
        (k + 1) +
        ")} = " +
        newValueEquationWValues;
      equationResult =
        underIndex("x", i + 1) + "^{(" + (k + 1) + ")} = " + newX[i];

      finalEquations.push(
        katex.renderToString(
          "\\begin{matrix} " +
            equation +
            " \\\\ " +
            equationWValues +
            " \\\\ " +
            equationResult +
            "\\end{matrix}"
        )
      );
    }

    addStep(
      (title = "Iteração k = " + k),
      (matrix = maTex(toMatrix(newX), "X^{(" + (k + 1) + ")} =")),
      (equations = finalEquations)
    );

    // Calculo do erro

    actualError = erroCalc(newX, oldX);

    showErrorCalc(newX, oldX, actualError, k);

    xTrack.push(newX.slice());
  } while (actualError > error && k < maxIter);

  addStep(
    (title = "Solução"),
    (matrix = maTex(toMatrix(newX), "X =")),
    (equations = [katex.renderToString("e = " + actualError)])
  );

  /*console.log(xTrack);
  console.log(actualError);
  console.log(newX);*/

  return xTrack;
}

function showSystem(matrix, bVector) {
  //preparando a exibição do sistema completo
  let xMatrix = [];

  //formação do vetor x
  for (let i = 0; i < matrix.length; i++) {
    xMatrix.push([underIndex("x", i + 1)]);
  }

  //apresenta o sistema inicial completo
  addStep(
    (title = "Sistema Inicial"),
    (equations = [
      maTex(matrix) + maTex(xMatrix) + maTex(toMatrix(bVector), " = ")
    ])
  );
}

function showOperationButton() {
  /*
    Mostra o botão de ação para utilizar o método de eliminação de Gauss
  */

  var btn = document.getElementById("btn");
  btn.innerHTML =
    '<a class="waves-effect waves-light btn-large" onclick="plot()">Aplicar Método de Jacobi</a>';
}

function showIteractionFuntion(matrix, matrixMult, bVector) {
  //preparando a exibição da função de iteração
  let xMatrix = [];

  //formação do vetor x
  for (let i = 0; i < matrix.length; i++) {
    xMatrix.push([underIndex("x", i + 1) + "^{(k+1)}"]);
  }
  //preparando a funação de iteração
  let funcIterationEquation = "";
  let funcIterationEquationWValues = "";
  let funcIterationFinal = [];
  let funcIterationFinalWValues = [];

  for (let i = 0; i < matrix.length; i++) {
    funcIterationEquation = "(" + bVector[i];
    funcIterationEquationWValues = math.round(bVector[i] / matrix[i][i], 3);

    for (let j = 0; j < matrix[i].length; j++) {
      if (j != i) {
        funcIterationEquation +=
          " - " + negative(matrix[i][j]) + underIndex("x", j + 1) + "^{(k)}";
        funcIterationEquationWValues +=
          " - " +
          negative(matrixMult[i][j]) +
          underIndex("x", j + 1) +
          "^{(k)}";
      }
    }

    funcIterationEquation += ")\\frac{1}{" + matrix[i][i] + "}";

    funcIterationFinal.push([funcIterationEquation]);
    funcIterationFinalWValues.push([funcIterationEquationWValues]);
  }

  //exibição da função de iteração
  addStep(
    (title = "Função de Iteração"),
    (matrix = ""),
    (equations = [
      maTex(xMatrix) + maTex(funcIterationFinal, "="),
      maTex(xMatrix) + maTex(funcIterationFinalWValues, "=")
    ])
  );
}

function showErrorCalc(newX, oldX, actualError, k) {
  addStep(
    (title = "Erro da Iteração k = " + k),
    (matrix = ""),
    (equations = [
      katex.renderToString(
        "e = \\dfrac{\\max\\{|x^{(" +
          (k + 1) +
          ")} - x^{(" +
          k +
          ")}|\\}}{\\max\\{|x^{(" +
          (k + 1) +
          ")}|\\}}"
      ),
      katex.renderToString(
        "e = \\dfrac{" +
          math.max(math.round(math.abs(math.subtract(newX, oldX)), 3)) +
          "}{" +
          math.max(math.round(newX, 3)) +
          "}"
      ),
      katex.renderToString("e = " + actualError)
    ])
  );
}

function hideOperationButton() {
  document.getElementById("btn").innerHTML = "";
}

function hidePlot() {
  document.getElementById("plotDiv").innerHTML = "";
}
