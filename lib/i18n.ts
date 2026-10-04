export const strings = {
  en: {
    description: "Compare your resume with a job. See what fits and what needs work.",
    resume: "Your resume", job: "Job description", example: "Load example",
    analyze: "Analyze", loading: "Analyzing…", password: "Password",
    report: "Your fit report", score: "Fit score", requirements: "Requirements",
    keywords: "Missing keywords", rewrites: "Rewrite suggestions",
    met: "Met", partial: "Partial", gap: "Gap", copy: "Copy suggestion",
    copied: "Copied", copyFailed: "Copy failed. Select and copy the suggestion manually.",
    empty: "None identified.",
    hint: "50 to 15,000 characters per field.",
    privacy: "Nothing is stored. Your text is sent to the model only for the analysis.",
    invalidInput: "Enter between 50 and 15,000 characters in each field.",
    wrongPassword: "The password is incorrect. Check it and try again.",
    analysisFailed: "The analysis could not be completed. Try again in a moment.",
  },
  pt: {
    description: "Compare o seu currículo com uma oferta. Veja o que corresponde e o que pode melhorar.",
    resume: "O seu currículo", job: "Descrição da oferta", example: "Carregar exemplo",
    analyze: "Analisar", loading: "A analisar…", password: "Palavra-passe",
    report: "O seu relatório", score: "Grau de correspondência", requirements: "Requisitos",
    keywords: "Palavras-chave em falta", rewrites: "Sugestões de reformulação",
    met: "Cumprido", partial: "Parcial", gap: "Em falta", copy: "Copiar sugestão",
    copied: "Copiado", copyFailed: "Não foi possível copiar. Selecione e copie a sugestão manualmente.",
    empty: "Nenhum identificado.",
    hint: "50 a 15 000 caracteres por campo.",
    privacy: "Nada é guardado. O seu texto é enviado ao modelo apenas para a análise.",
    invalidInput: "Introduza entre 50 e 15 000 caracteres em cada campo.",
    wrongPassword: "A palavra-passe está incorreta. Verifique-a e tente novamente.",
    analysisFailed: "Não foi possível concluir a análise. Tente novamente dentro de momentos.",
  },
};

export type Language = keyof typeof strings;
export type Labels = typeof strings.en;